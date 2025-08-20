import { Router } from 'express';
import passport from 'passport';
import {
  googleStrategy,
  jwtStrategy,
  getAuthStatus,
  setJWTToken,
  redirect,
  logout
} from '../controllers/authController';
import logger from '../../../setupPino';

const authRouter = Router();

passport.use(jwtStrategy());

/**
 * Configures Google OAuth strategy for Passport.js.
 * @param {string} accessToken - OAuth access token
 * @param {string} refreshToken - OAuth refresh token
 * @param {object} profile - Google user profile
 * @param {function} callback - Passport callback
 */
passport.use(googleStrategy());

// Routes for Google authentication
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/google', session: false }),
  setJWTToken,
  redirect
);

const optionalAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    req.user = user || null; // Attach user if valid, else null
    return next(); // Always continue
  })(req, res, next);
};

authRouter.get('/', optionalAuth, getAuthStatus);
authRouter.get('/logout', logout);

export default authRouter;
