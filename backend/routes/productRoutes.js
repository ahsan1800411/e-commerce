const express = require('express');
const {
  newProduct,
  allProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReviews,
} = require('../controllers/productControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const router = express.Router();

router
  .route('/admin/product/new')
  .post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);
router.route('/products').get(allProducts);
router.route('/product/:id').get(getSingleProduct);
router
  .route('/admin/product/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
router.route('/review').post(isAuthenticatedUser, createProductReview);
router
  .route('/reviews')
  .get(isAuthenticatedUser, getProductReviews)
  .delete(isAuthenticatedUser, deleteReviews);
module.exports = router;
