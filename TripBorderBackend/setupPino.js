import pino from 'pino';

// Configure log rotation for production (e.g., new file daily or when size exceeds 10MB)
const transport = pino.transport({
  target: 'pino-roll',
  options: {
    file: './logs/app.log', // Log file path
    frequency: 'daily', // Rotate daily (or use '1h' for hourly, etc.)
    size: '10m', // Rotate when file exceeds 10MB
    mkdir: true, // Create logs directory if it doesn't exist
  },
});

// Create and configure the Pino logger
const logger = pino(
  {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    timestamp: pino.stdTimeFunctions.isoTime,
    // Pretty print in development
    ...(process.env.NODE_ENV !== 'production' && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    }),
  },
  // Use log rotation in production
  process.env.NODE_ENV === 'production' ? transport : undefined
);

export default logger;
