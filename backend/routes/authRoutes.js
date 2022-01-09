const express = require('express');
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
} = require('../controllers/authControllers');
const { isAuthenticatedUser } = require('../middlewares/auth');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser, getUserProfile);

module.exports = router;
