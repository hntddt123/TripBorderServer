import express from 'express';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import morgan from 'morgan'; // logger
import helmet from 'helmet';
import https from 'https';
import fs from 'fs';
import cors from 'cors';

import loginRouter from './api/routes/login';
import apiRouter from './api/routes/api';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const app = express();
const serverPort = process.env.PORT;

if (process.env.NODE_ENV === 'development') {
  console.log('Environment Variables:', {
    NODE_ENV: process.env.NODE_ENV,
    NGINX_CONF: process.env.NGINX_CONF,
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
    BACKEND_ORIGIN: process.env.BACKEND_ORIGIN,
    DB_PORT: process.env.DB_PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME
  });
}

const allowedOrigins = process.env.FRONTEND_ORIGIN.split(',');

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

const httpsServer = https.createServer(options, app);

app.use(loginRouter);
app.use(apiRouter);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit to 100 requests per window
  message: 'Too many requests from this IP, please try again later.'
}));

app.get('/easteregg', (req, res) => {
  console.log('Found an egg');
  res.send('Found an egg on your trip!');
});

httpsServer.listen(serverPort, () => {
  console.log(`Trip Border ${process.env.VERSION} ${process.env.NODE_ENV} server listening at ${process.env.BACKEND_ORIGIN}:${serverPort}`);
});
