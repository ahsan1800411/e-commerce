const JWT = require('jsonwebtoken');
// create and send token and save in the cookie;

const sendToken = (user, statusCode, res) => {
  //  Assign a token to the user
  const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: 360000,
  });

  //   options for cookies;
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIES_EXPIRES_TIMES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
