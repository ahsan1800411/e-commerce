const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

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

  sendToken(newUser, 201, res);
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

  sendToken(user, 200, res);
});

// Forgot Password ==> /api/v1/password/forgot; >> post Request;

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ErrorHandler('User not found', 400));

  //  get Reset token;
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // create password url;

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follows: \n\n${resetUrl} \n\n If you have not requested this email please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'ShopIt password Recovery',
      message,
    });
    res.json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 400));
  }
});

// logout user >>> get Request >>> /api/v1/logout;

exports.logout = catchAsyncErrors(async (req, res, next) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };
  res.cookie('token', null, options);
  res.json({
    success: true,
    message: 'Logged out',
  });
});
