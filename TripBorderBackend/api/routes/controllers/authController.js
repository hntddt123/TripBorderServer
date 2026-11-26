import jwt from 'jsonwebtoken';
import { cleanEnv, str } from 'envalid';
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
  // Comma-separated list supported (e.g. https://tripborder.com,https://www.tripborder.com)
  // Primary (first) origin is used for JWT iss/aud and auth redirect
  FRONTEND_ORIGIN: str(),
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

// Canonical frontend origin for JWT claims and redirects
const primaryFrontendOrigin = FRONTEND_ORIGIN.split(',')[0].trim();

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
  issuer: primaryFrontendOrigin,
  audience: primaryFrontendOrigin
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

const accessCookieOptions = {
  httpOnly: true, // Prevents JS access
  secure: true,
  sameSite: 'strict', // Mitigates CSRF
  maxAge: ACCESS_EXP, // 1h in ms
  path: '/' // Available site-wide
};

export const redirect = (req, res) => {
  res.redirect(`${primaryFrontendOrigin}/?auth=success`);
};

export const setJWTToken = (req, res, next) => {
  // Sign JWT on successful Google auth (Issue token after verification)
  try {
    const payload = {
      sub: req.user.uuid,
      role: req.user.role,
      iss: primaryFrontendOrigin,
      aud: primaryFrontendOrigin
    }; // Customize with needed claims
    const token = tokenService.generateAccessToken(payload);
    const refreshToken = tokenService.generateRefreshToken(payload);

    res.cookie('jwtAccess', token, accessCookieOptions);
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

/**
 * Resolves the current user from the jwtAccess cookie, falling back to the
 * jwtRefresh cookie when the access token is missing. Always resolves to a
 * user_accounts row or null; rejects only on unexpected errors.
 */
export const authenticateFromCookies = (req, res) => new Promise((resolve, reject) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err) {
      logger.error(err);
      return reject(err);
    }

    if (user) {
      return resolve(user);
    }

    const noAccessToken = info && info.message === 'No auth token';
    const jwtRefresh = req.cookies ? req.cookies.jwtRefresh : undefined;
    if (!noAccessToken || !jwtRefresh) {
      return resolve(null);
    }

    try {
      // Verify refresh; throws if invalid/expired
      const refreshed = tokenService.verifyRefreshToken(jwtRefresh);
      const refreshedUser = await loadUserDB(refreshed.sub);
      if (!refreshedUser) {
        return resolve(null);
      }
      // Re-issue access token with the current role from the DB (not the old claim)
      const newAccessToken = tokenService.generateAccessToken({
        sub: refreshedUser.uuid,
        role: refreshedUser.role,
        iss: primaryFrontendOrigin,
        aud: primaryFrontendOrigin
      });
      res.cookie('jwtAccess', newAccessToken, accessCookieOptions);
      return resolve(refreshedUser);
    } catch (refreshErr) {
      logger.error(refreshErr);
      return resolve(null);
    }
  })(req, res);
});

// Attaches req.user (or null) and always continues
export const optionalAuth = async (req, res, next) => {
  try {
    req.user = await authenticateFromCookies(req, res);
    return next();
  } catch (error) {
    return next(error);
  }
};

// 401 unless a valid session cookie is present
export const requireAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      req.user = await authenticateFromCookies(req, res);
    }
    if (!req.user) {
      return res.status(401).json({ isAuthenticated: false, message: 'Auth failed' });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

// 401 when logged out, 403 when the role is not allowed
export const requireRole = (...roles) => (req, res, next) => requireAuth(req, res, (err) => {
  if (err) return next(err);
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  return next();
});

export const requireAdmin = requireRole('admin');

export const isAdmin = (user) => !!user && user.role === 'admin';

export const getAuthStatus = (req, res) => {
  if (req.user) {
    return res.json({
      isAuthenticated: true,
      uuid: req.user.uuid,
      email: req.user.email,
      provider: req.user.provider,
      name: req.user.name,
      profile_picture: req.user.profile_picture,
      created_at: req.user.created_at,
      updated_at: req.user.updated_at,
      role: req.user.role,
      trial_started_at: req.user.trial_started_at,
      is_trialed: req.user.is_trialed,
      premium_started_at: req.user.premium_started_at,
      subscription_end_at: req.user.subscription_end_at
    });
  }
  return res.status(401).json({
    isAuthenticated: false,
    message: 'Auth failed'
  });
};

export const logout = (req, res) => {
  res.clearCookie('jwtAccess', { path: '/' });
  res.clearCookie('jwtRefresh', { path: '/' });
  res.json({ message: 'Logged out successfully' });
};
