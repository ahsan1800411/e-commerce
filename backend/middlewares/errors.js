const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // DEVELOPMENT Erors;

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Production Errors
  if (process.env.NODE_ENV === 'PRODUCTION') {
    // Wrong Mongoose Object Id Error;
    if (err.name === 'CastError') {
      const message = `Resource not found. Invalid ${err.path}`;
      err = new ErrorHandler(message, 400);
    }

    // Validation Errors;
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((d) => d.message);
      err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
};

// Object.values();
// Object.keys();
// Object.entries()
