const express = require('express');
const {
  register,
  login,
  logout,
  forgotPassword,
} = require('../controllers/authControllers');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPassword);

module.exports = router;
