const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGO_URI;
const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI1, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to db");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connection;
