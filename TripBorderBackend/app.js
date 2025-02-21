import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan'; // logger
import helmet from 'helmet';
import https from 'https';
import fs from 'fs';
import cors from 'cors';

import loginRouter from './api/routes/login';

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

app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true
}));

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};

const httpsServer = https.createServer(options, app);

app.use(loginRouter);

app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.send('TEST Hello World!');
});

httpsServer.listen(serverPort, () => {
  console.log(`Trip Border ${process.env.NODE_ENV} server listening at ${process.env.BACKEND_ORIGIN}:${serverPort}`);
});
