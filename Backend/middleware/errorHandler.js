/**
 * Centralized Error Handling Middleware
 * Intercepts uncaught errors and formats consistent JSON error responses.
 */

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const isProduction = process.env.NODE_ENV === 'production';

  console.error('[Error Occurred]:', {
    message: err.message,
    stack: isProduction ? undefined : err.stack,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || null,
    ...(isProduction ? {} : { stack: err.stack })
  });
};

module.exports = errorHandler;
