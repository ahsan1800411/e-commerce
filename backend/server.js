const dotenv = require('dotenv');
const app = require('./app');
const connectDatabase = require('./config/db');

dotenv.config({ path: 'backend/config/config.env' });

const port = process.env.PORT || 5000;

connectDatabase();

app.listen(port, () => {
  console.log(
    `Server is listening on port ${port} in ${process.env.NODE_ENV} mode`
  );
});
