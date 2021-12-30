const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middlewares/errors');

app.use(express.json());

// routes

app.use('/api/v1', productRoutes);
app.use('/api/v1', authRoutes);

// middlewares;

app.use(errorMiddleware);
module.exports = app;
