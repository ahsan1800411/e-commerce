module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // DEVELOPMENT Erors;

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      stack: err.stack,
    });
  }

  // Production Errors
  if (process.env.NODE_ENV === 'PRODUCTION') {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
};
