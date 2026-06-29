/**
 * Error Handler Middleware
 * 
 * Centralizes error handling and response formatting
 */

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Main error handler
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let status = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';
  let details = null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
    code = 'VALIDATION_ERROR';
  } else if (err.code === 'ENOENT') {
    status = 404;
    message = 'File not found';
    code = 'FILE_NOT_FOUND';
  } else if (err.message.includes('API')) {
    status = 503;
    message = 'Transcription service unavailable';
    code = 'SERVICE_ERROR';
    details = process.env.NODE_ENV === 'development' ? err.message : null;
  } else if (err.message) {
    message = err.message;
    code = 'ERROR';
  }

  res.status(status).json({
    success: false,
    error: message,
    code,
    ...(details && { details })
  });
};

module.exports = {
  errorHandler,
  asyncHandler
};
