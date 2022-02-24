const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected with DB with host ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDatabase;
