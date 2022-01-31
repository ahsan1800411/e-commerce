const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

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

  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: 'avatars',
    width: 150,
    crop: 'scale',
  });

  let newUser = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
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

// Reset Password ==> /api/v1/password/resest/:token;
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash url token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    // resetPasswordExpire: { $gt: Date.now() },
  });
  console.log(user);
  if (!user) {
    return next(
      new ErrorHandler(
        'Password reset token is invalid or has been expires',
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password doesn"t match', 400));
  }

  // set up the new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

// get current user profile ==> /api/v1/me >> get request;
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.json({
    success: true,
    user,
  });
});

// update/change password ==> put request >>/api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  //  checks previous user password;
  const isMatched = await bcrypt.compare(req.body.oldPassword, user.password);
  if (!isMatched) {
    return next(new ErrorHandler("Old password doesn't match'", 400));
  }
  user.password = req.body.password;
  await user.save();
  sendToken(user, 200, res);
});

// update user profile ==> /api/v1/me/update >> put request ;
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.json({
    success: true,
    message: 'Updated user successfully',
  });
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

// admin routes ==> get all users ==> /api/v1/admin/users >> get request
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.json({
    success: true,
    users,
  });
});

// get user details ==> get request >>> /api/admin/user/:id;

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler('User not found', 400));

  res.json({
    success: true,
    user,
  });
});

// update user profile ==> /api/v1/admin/user/:id >>>> put request ;
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.json({
    success: true,
    message: 'User successfully updated',
  });
});

// delete User profile ==> /api/v1/admin/user/:id >>>> delete request;

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler('User not found', 400));
  }
  await user.remove();

  res.json({
    success: true,
    message: 'User Successfully deleted',
  });
});
