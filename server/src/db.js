import mongoose from "mongoose";
import dns from "dns";

// Fix Windows DNS querySrv ECONNREFUSED resolving Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Could not set custom DNS servers, using system defaults:", e.message);
}

export async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/verifyx";
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
