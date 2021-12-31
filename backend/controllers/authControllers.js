const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// register User ==> Post Request >> /api/v1/register;

exports.register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Checks if the user is alredy in the database
  const emailExist = await User.findOne({ email });
  if (emailExist) return next(new ErrorHandler(`Email already exists`, 400));
  const isValidPassword = validator.isLength(password, { min: 6 });
  if (!isValidPassword) {
    return next(
      new ErrorHandler(`Password must be at least 6 characters long`, 400)
    );
  }

  // Encrypting a password;
  const hashPassword = await bcrypt.hash(password, 10);

  let newUser = await User.create({
    name,
    email,
    password: hashPassword,
    avatar: {
      public_id: 'Hi, There',
      url: 'https://hfmfnhfngmg',
    },
  });

  res.json({ success: true, newUser });
});
