const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const JWT = require('jsonwebtoken');
const User = require('../models/user');

// checks if the user is authenticated or not;
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler('Login First to access this route', 401));
  }

  //   verify token;
  const decoded = JWT.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

// Handling User roles;
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      return next(
        new ErrorHandler(
          `Role ${role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
