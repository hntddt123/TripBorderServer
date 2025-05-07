import { Router } from 'express';
import session from 'express-session';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import fs from 'fs';
import ms from 'ms';
import crypto from 'crypto';
import { cleanEnv, str, url } from 'envalid';
import { upsertUserOnGoogleLogin } from '../knex/loginknex';
import logger from '../../setupPino';

const env = cleanEnv(process.env, {
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  SESSION_SECRET: str({ default: crypto.randomBytes(32).toString('hex') }),
  DB_HOST: str(),
  DB_USER: str(),
  DB_NAME: str(),
  FRONTEND_ORIGIN: url(),
});

const SessionStore = connectPgSimple(session);

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = env;
const { DB_HOST, DB_USER, DB_NAME } = env;
const { SESSION_SECRET } = env;
const { FRONTEND_ORIGIN } = env;

let DB_PASSWORD = '';

try {
  DB_PASSWORD = fs.readFileSync('/run/secrets/db_password', 'utf8').trim();
} catch (error) {
  logger.error(`Failed to read DB password: ${error}`);
  process.exit(1);
}

const loginRouter = Router();

const pgPool = new pg.Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: 5432,
  max: 20, // Max connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000 // Timeout for new connections
});

loginRouter.use(session({
  store: new SessionStore({
    pool: pgPool,
    tableName: 'session'
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: ms('1 year'),
    sameSite: 'strict'
  }
}));

// Middleware for routes
loginRouter.use(passport.initialize());
loginRouter.use(passport.session());

/**
 * Configures Google OAuth strategy for Passport.js.
 * @param {string} accessToken - OAuth access token
 * @param {string} refreshToken - OAuth refresh token
 * @param {object} profile - Google user profile
 * @param {function} callback - Passport callback
 */
passport.use(new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, callback) => {
    // fetch or create user here based on profile data
    try {
      const user = await upsertUserOnGoogleLogin(profile);
      callback(null, user);
    } catch (err) {
      callback(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Routes for Google authentication
loginRouter.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

loginRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(`${FRONTEND_ORIGIN.split(',')[0]}/?auth=success`);
  }
);

loginRouter.get('/', (req, res) => {
  if (req.user) {
    res.json({
      isLoggedIn: true,
      uuid: req.user.uuid,
      email: req.user.email,
      provider: req.user.provider,
      provider_user_id: req.user.provider_user_id,
      name: req.user.name,
      profilePicture: req.user.profile_picture,
      createdAt: req.user.created_at,
      updatedAt: req.user.updated_at,
      role: req.user.role
    });
  } else {
    res.json({
      isLoggedIn: false
    });
  }
});

// Logout route
loginRouter.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      logger.error(err);
      res.status(500).send('An error occurred while logging out');
    } else {
      res.clearCookie('connect.sid');
      res.redirect('/');
    }
  });
});

export default loginRouter;
