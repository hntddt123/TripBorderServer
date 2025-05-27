import { Router } from 'express';
import passport from 'passport';
import {
  googleStrategy,
  redirect,
  setupSession,
  getAuthstatus,
  logout
} from '../controllers/authController';

const authRouter = Router();

authRouter.use(setupSession());

// Middleware for routes
authRouter.use(passport.initialize());
authRouter.use(passport.session());

/**
 * Configures Google OAuth strategy for Passport.js.
 * @param {string} accessToken - OAuth access token
 * @param {string} refreshToken - OAuth refresh token
 * @param {object} profile - Google user profile
 * @param {function} callback - Passport callback
 */
passport.use(googleStrategy());
passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((obj, done) => { done(null, obj); });

// Routes for Google authentication
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/login' }),
  redirect
);

authRouter.get('/', getAuthstatus);
authRouter.get('/logout', logout);

export default authRouter;
