const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

const errorMiddleware = require('./middlewares/errors');

app.use(express.json());
app.use(cookieParser());

// routes

app.use('/api/v1', productRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', orderRoutes);

// middlewares;

app.use(errorMiddleware);
module.exports = app;
