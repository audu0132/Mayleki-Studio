/**
 * Request Logger Middleware
 * Logs incoming HTTP requests and response latency in development and staging.
 */

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const logMessage = `[${new Date().toISOString()}] ${method} ${originalUrl} ${statusCode} - ${duration}ms - ${ip}`;
    
    if (statusCode >= 400) {
      console.warn('\x1b[33m%s\x1b[0m', logMessage);
    } else {
      console.log('\x1b[32m%s\x1b[0m', logMessage);
    }
  });

  next();
};

module.exports = requestLogger;
