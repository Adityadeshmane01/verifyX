import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/verifyx";
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully to:", uri);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
