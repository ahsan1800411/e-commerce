const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const errorMiddleware = require('./middlewares/errors');

app.use(express.json());

// routes

app.use('/api/v1', productRoutes);

// middlewares;

app.use(errorMiddleware);
module.exports = app;
