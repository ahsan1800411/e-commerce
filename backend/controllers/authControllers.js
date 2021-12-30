const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/user');
// register User ==> Post Request >> /api/v1/register;

exports.register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Checks if the user is alredy in the database
  const emailExist = await User.findOne({ email });
  if (emailExist)
    return res
      .status(400)
      .json({ succes: false, message: 'Email already existed ' });

  let newUser = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'Hi, There',
      url: 'https://hfmfnhfngmg',
    },
  });

  res.json({ success: true, newUser });
});
