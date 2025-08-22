import jwt from 'jsonwebtoken';
import { cleanEnv, str, url } from 'envalid';
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import GoogleStrategy from 'passport-google-oauth20';
import { loadUserDB, upsertUserOnGoogleLoginDB } from '../../knex/authknex';

import logger from '../../../setupPino';

const env = cleanEnv(process.env, {
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  ACCESS_EXP: str(),
  REFRESH_EXP: str(),
  DB_HOST: str(),
  DB_USER: str(),
  DB_NAME: str(),
  FRONTEND_ORIGIN: url(),
});

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FRONTEND_ORIGIN,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_EXP,
  REFRESH_EXP
} = env;

// Token service (DIP: Interface-like, injectable for testing)
const tokenService = {
  generateAccessToken: (payload) => jwt.sign(payload, JWT_ACCESS_SECRET, { algorithm: 'HS512' }),
  generateRefreshToken: (payload) => jwt.sign(payload, JWT_REFRESH_SECRET, { algorithm: 'HS512' }),
  verifyAccessToken: (token) => jwt.verify(token, JWT_ACCESS_SECRET, { algorithm: 'HS512' }),
  verifyRefreshToken: (token) => jwt.verify(token, JWT_REFRESH_SECRET, { algorithm: 'HS512' })
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => (req.cookies ? req.cookies.jwtAccess : null) // Custom extractor for cookie
  ]),
  secretOrKey: JWT_ACCESS_SECRET,
  issuer: FRONTEND_ORIGIN,
  audience: FRONTEND_ORIGIN
};

/**
 * payload format {
 * sub: 'uuid for user'
 * role: 'user, premium_user, admin'
 * iss: domain
 * aud: domain
 * iat: issue at
 * exp: expiration at
 * }
 */
export const jwtStrategy = () => new Strategy(jwtOptions, async (payload, done) => {
  try {
    // Assuming user lookup from DB (e.g., via Knex/PostgreSQL from previous context)
    const user = await loadUserDB(payload.sub);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});

export const googleStrategy = () => new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, callback) => {
    // fetch or create user here based on profile data
    try {
      const user = await upsertUserOnGoogleLoginDB(profile);
      callback(null, user);
    } catch (err) {
      callback(err);
    }
  }
);

export const redirect = (req, res) => {
  res.redirect(`${FRONTEND_ORIGIN}/?auth=success`);
};

export const setJWTToken = (req, res, next) => {
  // Sign JWT on successful Google auth (Issue token after verification)
  try {
    const payload = {
      sub: req.user.uuid,
      role: req.user.role,
      iss: FRONTEND_ORIGIN,
      aud: FRONTEND_ORIGIN
    }; // Customize with needed claims
    const token = tokenService.generateAccessToken(payload);
    const refreshToken = tokenService.generateRefreshToken(payload);

    res.cookie('jwtAccess', token, {
      httpOnly: true, // Prevents JS access
      secure: true,
      sameSite: 'strict', // Mitigates CSRF
      maxAge: ACCESS_EXP, // 1h in ms
      path: '/' // Available site-wide
    });
    res.cookie('jwtRefresh', refreshToken, {
      httpOnly: true, // Prevents JS access
      secure: true,
      sameSite: 'strict', // Mitigates CSRF
      maxAge: REFRESH_EXP, // 30 Days in ms
      path: '/' // Available site-wide
    });

    next();
  } catch (error) {
    // Optional: Log/handle error
    logger.error('Token generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      logger.error(err);
      return next(err); // Pass errors downstream
    }

    if (user) {
      req.user = user; // Valid access: Attach user
      return next();
    }

    // Check for expiration specifically
    if (info && info.message === 'No auth token') {
      const { jwtRefresh } = req.cookies; // Extract refresh cookie
      if (!jwtRefresh) {
        req.user = null; // No refresh: Optional, proceed as unauth
        return next();
      }

      try {
        const refreshedUser = tokenService.verifyRefreshToken(jwtRefresh); // Verify refresh; throws if invalid/expired
        const newAccessToken = tokenService.generateAccessToken(refreshedUser); // Generate new access with same payload
        res.cookie(
          'jwtAccess',
          newAccessToken,
          {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: ACCESS_EXP
          }
        ); // Set new cookie (1h ms)
        req.user = refreshedUser; // Attach refreshed user
        return next();
      } catch (refreshErr) {
        logger.error(refreshErr);
        req.user = null; // Refresh failed: Proceed as unauth
        return next();
      }
    }

    // Other failures (e.g., invalid signature): Proceed as unauth
    req.user = null;
    return next();
  })(req, res, next);
};

export const getAuthStatus = (req, res) => {
  if (req.user) {
    res.json({
      isAuthenticated: true,
      uuid: req.user.uuid,
      email: req.user.email,
      provider: req.user.provider,
      provider_user_id: req.user.provider_user_id,
      name: req.user.name,
      profile_picture: req.user.profile_picture,
      created_at: req.user.created_at,
      updated_at: req.user.updated_at,
      role: req.user.role,
      trial_started_at: req.user.trial_started_at,
      is_trialed: req.user.is_trialed
    });
  } else {
    res.json({
      isAuthenticated: false
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie('jwtAccess', { path: '/' });
  res.clearCookie('jwtRefresh', { path: '/' });
  res.json({ message: 'Logged out successfully' });
};
