const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const JWT = require('jsonwebtoken');

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

  // Assign a token to the user
  const token = JWT.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: 360000,
  });

  res.json({ success: true, token });
});

//  login user >> Post request >> /api/v1/login

exports.login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler('Please fill all the credentials', 400));

  // check if the user exist in the database or not
  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new ErrorHandler('User not found', 400));

  // compare the password ;
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword)
    return next(new ErrorHandler("Password doe'nt match", 400));

  //  Assign a token to the user
  const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: 360000,
  });

  res.json({ success: true, token });
});
