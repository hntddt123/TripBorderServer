import express from 'express';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import helmet from 'helmet';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import client from 'prom-client';
import logger, { httpLogger } from './setupPino';
import apiRouter from './api/routes/api';

// Create a Registry to store metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register }); // auto-collects CPU, memory, event loop, etc.

// Custom metrics example (optional but useful)
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const app = express();
const serverPort = process.env.PORT;
const allowedOrigins = process.env.FRONTEND_ORIGIN.split(',');

if (process.env.NODE_ENV === 'development') {
  logger.info('Environment Variable');
  logger.info({
    NODE_ENV: process.env.NODE_ENV,
    NGINX_CONF: process.env.NGINX_CONF,
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
    BACKEND_ORIGIN: process.env.BACKEND_ORIGIN,
    DB_PORT: process.env.DB_PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    SSL_KEY_PATH: process.env.SSL_KEY_PATH,
    SSL_CERT_PATH: process.env.SSL_CERT_PATH,
    allowedOrigins: allowedOrigins
  });
}

app.set('trust proxy', 1);
app.use(httpLogger);
app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

const httpsServer = https.createServer(options, app);

app.use('/api', apiRouter);

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 m`inutes
  max: 100, // Limit to 100 requests per window
  message: 'Too many requests from this IP, please try again later.'
}));

app.use((err, req, res, next) => {
  logger.error('Unexpected error:', err.message, err.stack);
  res.status(500).json({ message: `Internal server error: ${err.message}` });
});

app.get('/', (req, res) => {
  httpRequestsTotal.inc({ method: 'GET', route: '/', status: '200' });
  res.send('TripBorder Backend is running!');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/easteregg', (req, res) => {
  logger.info('Found an egg');
  res.send('Found an egg on your trip!');
});

httpsServer.listen(serverPort, () => {
  logger.info(
    `Trip Border ${process.env.VERSION} ${process.env.NODE_ENV} server 
    listening at ${process.env.BACKEND_ORIGIN}:${serverPort}`
  );
});
