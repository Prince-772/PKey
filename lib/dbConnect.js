import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const ConnectToDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(MONGO_URI);
  } catch (err) {
    console.error("DB connection error:", err.message || err);
    throw new Error("Failed to connect to Database");
  }
};

export default ConnectToDB;
