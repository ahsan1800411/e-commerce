const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const errorMiddleware = require('./middlewares/errors');

// middlewares;
app.use(express.json());
app.use(errorMiddleware);

// routes

app.use('/api/v1', productRoutes);

module.exports = app;
