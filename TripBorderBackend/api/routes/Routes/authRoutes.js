import { Router } from 'express';
import passport from 'passport';
import {
  googleStrategy,
  jwtStrategy,
  getAuthStatus,
  setJWTToken,
  optionalAuth,
  redirect,
  logout
} from '../controllers/authController';

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

authRouter.get('/', optionalAuth, getAuthStatus);
authRouter.get('/logout', logout);

export default authRouter;
