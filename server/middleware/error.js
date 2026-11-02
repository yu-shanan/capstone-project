const ErrorHandler = require('../utils/ErrorHandler');

/**
 * Central error handler.
 * Every controller calls next(err); this is the single place that turns an
 * error into a consistent JSON response: { success: false, message }.
 * It must be registered after all routes in app.js.
 */
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose: invalid ObjectId (e.g. /api/projects/123)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found: invalid ${err.path} "${err.value}"`;
  }

  // Mongoose: schema validation failed
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // MongoDB: duplicate key (unique index on username / email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists`;
  }

  // express.json(): malformed request body
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  // jsonwebtoken errors that reach the handler
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized, token invalid or expired';
  }

  // Log unexpected server errors so they are not silent
  if (statusCode >= 500) {
    console.error('[error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500
      ? { stack: err.stack }
      : {}),
  });
};

module.exports = errorMiddleware;
