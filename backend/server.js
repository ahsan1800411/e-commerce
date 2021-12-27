const dotenv = require('dotenv');
const app = require('./app');
const connectDatabase = require('./config/db');

process.on('uncaughtException', (err) => {
  console.log(`Error:${err.stack}`);
  console.log(`Shutting down the server due to UnCaught Exceptions`);
  process.exit(1);
});

dotenv.config({ path: 'backend/config/config.env' });

const port = process.env.PORT || 5000;

connectDatabase();

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
