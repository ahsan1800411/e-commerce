const express = require('express');
const {
  newProduct,
  allProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productControllers');
const { isAuthenticatedUser } = require('../middlewares/auth');
const router = express.Router();

router.route('/admin/product/new').post(isAuthenticatedUser, newProduct);
router.route('/products').get(allProducts);
router.route('/product/:id').get(getSingleProduct);
router
  .route('/admin/product/:id')
  .put(isAuthenticatedUser, updateProduct)
  .delete(isAuthenticatedUser, deleteProduct);

module.exports = router;
