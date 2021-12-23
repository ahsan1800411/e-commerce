const Product = require('../models/product');

// create a new product >> /api/v1/product/new  >> POST REQUEST;

exports.newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.json({
    success: true,
    product,
  });
};
