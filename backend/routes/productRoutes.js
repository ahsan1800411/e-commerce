const express = require('express');
const {
  newProduct,
  allProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productControllers');
const router = express.Router();

router.route('/admin/product/new').post(newProduct);
router.route('/products').get(allProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/product/:id').put(updateProduct).delete(deleteProduct);

module.exports = router;
