const express = require('express');

const router = express.Router();
const {
  newOrder,
  getSingleOrder,
  getAllOrders,
  getAdminAllOrders,
} = require('../controllers/orderControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, getAllOrders);
router
  .route('/admin/orders')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAdminAllOrders);

module.exports = router;
