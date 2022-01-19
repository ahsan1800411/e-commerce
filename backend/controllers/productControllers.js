const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');

// create a new product >> /api/v1/admin/product/new  >> POST REQUEST;

exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// get all products >> /api/v1/products  >> GET REQUEST;
exports.allProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const products = await apiFeatures.query;
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

//  >>/api/v1/review => create new review  ==> post request
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const newReview = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  //  update the  existing product review;
  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(newReview);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.json({
    success: true,
  });
});

// get all product reviews => /api/v1/reviews;  ==> get request;
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  res.json({ success: true, reviews: product.reviews });
});

// delete Reviews  ==> /api/v1/reviews;   ==> delete reviews;
exports.deleteReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, numOfReviews, ratings },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.json({ success: true });
});
