const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');

// middlewares;
app.use(express.json());

// routes

app.use('/api/v1', productRoutes);

module.exports = app;
