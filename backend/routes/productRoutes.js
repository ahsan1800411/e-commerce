const express = require('express');
const { newProduct } = require('../controllers/productControllers');
const router = express.Router();

router.route('/product/new').post(newProduct);

module.exports = router;
