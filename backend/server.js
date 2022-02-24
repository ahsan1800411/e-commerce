const dotenv = require('dotenv');
const app = require('./app');
const connectDatabase = require('./config/db');
const cloudinary = require('cloudinary').v2;

process.on('uncaughtException', (err) => {
  console.log(`Error:${err.stack}`);
  console.log(`Shutting down the server due to UnCaught Exceptions`);
  process.exit(1);
});

dotenv.config({ path: 'backend/config/config.env' });

const port = process.env.PORT || 5000;

connectDatabase();

// setting up the cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(port, () => {
  console.log(
    `Server is listening on port ${port} in ${process.env.NODE_ENV} mode`
  );
});

// Handling UnHandled Promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error:${err.stack}`);
  console.log(`Shutting down the server due to UnHandle Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
