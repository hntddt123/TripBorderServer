import jwt from 'jsonwebtoken';
import { cleanEnv, str, url } from 'envalid';
import { Strategy, ExtractJwt } from 'passport-jwt';
import GoogleStrategy from 'passport-google-oauth20';
import { loadUserDB, upsertUserOnGoogleLoginDB } from '../../knex/authknex';

import logger from '../../../setupPino';

const env = cleanEnv(process.env, {
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  JWT_SECRET: str(),
  DB_HOST: str(),
  DB_USER: str(),
  DB_NAME: str(),
  FRONTEND_ORIGIN: url(),
});

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FRONTEND_ORIGIN,
  JWT_SECRET
} = env;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => (req.cookies ? req.cookies.jwt : null) // Custom extractor for cookie
  ]),
  secretOrKey: JWT_SECRET,
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
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { algorithm: 'HS512', expiresIn: '1h' }, // Short expiration best practice
    );

    res.cookie('jwt', token, {
      httpOnly: true, // Prevents JS access
      secure: true,
      sameSite: 'strict', // Mitigates CSRF
      maxAge: 60 * 60 * 1000, // 1h in ms
      path: '/' // Available site-wide
    });

    next();
  } catch (error) {
    // Optional: Log/handle error
    logger.error('Token generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
  res.clearCookie('jwt', { path: '/' });
  res.json({ message: 'Logged out successfully' });
};
