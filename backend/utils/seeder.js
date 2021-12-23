const dotenv = require('dotenv');
const Product = require('../models/product');
const products = require('../data/products.json');
const connectDatabase = require('../config/db');

dotenv.config({ path: 'backend/config/config.env' });

connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log('All product are deleted');
    await Product.insertMany(products);
    console.log('All product are inserted');
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedProducts();
