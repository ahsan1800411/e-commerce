const Product = require('../models/product');

// create a new product >> /api/v1/admin/product/new  >> POST REQUEST;

exports.newProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};

// get all products >> /api/v1/products  >> GET REQUEST;
exports.allProducts = async (req, res, next) => {
  const products = await Product.find();
  res.json({
    success: true,
    count: products.length,
    products,
  });
};

// get single product >> /api/v1/product/:id >> GET REQUEST;
exports.getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(400).json({
      success: false,
      message: 'Product not found',
    });
  }
  res.json({
    success: true,
    product,
  });
};

// update product >> /api/v1/admin/product/:id >> put request

exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(400).json({
      success: false,
      message: 'Product not found',
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.json({
    success: true,
    product,
  });
};

// delete a product /api/v1/admin/product/:id >> delete request

exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(400).json({
      success: false,
      message: 'Product not found',
    });
  }
  await product.remove();
  res.json({ success: true, message: 'Product deleted' });
};
