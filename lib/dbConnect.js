const mongoose = require("mongoose")

const MONGO_URI = process.env.MONGO_URI
const ConnectToDB = async () => {
  if (mongoose.connections[0].readyState) return

  try {
    await mongoose.connect(MONGO_URI)
    console.log("Connected To MongoDB");
  } catch (err) {
    console.log("DB connection error:",(err.message || err));
  }
}

module.exports = ConnectToDB