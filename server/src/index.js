import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import verificationRoutes from "./routes/verifications.js";
import { loadModels } from "./services/ai.js";

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Preload face matching models
loadModels().catch(err => console.error("Failed to load models on startup:", err));

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Static Files (for serving uploaded identity documents and selfies)
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/verifications", verificationRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
