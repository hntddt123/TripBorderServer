import client from 'prom-client';

// Create a Registry to store metrics
export const register = new client.Registry();
client.collectDefaultMetrics({ register }); // auto-collects CPU, memory, event loop, etc.

// Custom metrics example (optional but useful)
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

export const httpRequestMiddleware = (req, res, next) => {
  res.on('finish', () => {
    // This captures the full path when using mounted routers
    const route = req.baseUrl + (req.route ? req.route.path : req.path || req.originalUrl);

    httpRequestsTotal.inc({
      method: req.method,
      route: route || 'unknown',
      status: res.statusCode.toString()
    });
  });
  next();
};
