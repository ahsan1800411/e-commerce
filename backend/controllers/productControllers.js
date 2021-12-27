const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// create a new product >> /api/v1/admin/product/new  >> POST REQUEST;

exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// get all products >> /api/v1/products  >> GET REQUEST;
exports.allProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();
  res.json({
    success: true,
    count: products.length,
    products,
  });
});

// get single product >> /api/v1/product/:id >> GET REQUEST;
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return next(
      new ErrorHandler(`Product not found with id ${req.params.id}`, 400)
    );
  res.json({
    success: true,
    product,
  });
});

// update product >> /api/v1/admin/product/:id >> put request

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product)
    return next(
      new ErrorHandler(`Product not found with id ${req.params.id}`, 400)
    );

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.json({
    success: true,
    product,
  });
});

// delete a product /api/v1/admin/product/:id >> delete request

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return next(
      new ErrorHandler(`Product not found with id ${req.params.id}`, 400)
    );
  await product.remove();
  res.json({ success: true, message: 'Product deleted' });
});
