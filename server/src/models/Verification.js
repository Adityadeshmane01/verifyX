import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  documentUrl: {
    type: String,
    required: true,
  },
  selfieUrl: {
    type: String,
    default: "",
  },
  documentType: {
    type: String,
    enum: ["Passport", "Aadhaar", "Driver's License", "National ID", "Unknown"],
    default: "Unknown",
  },
  extractedData: {
    name: String,
    dob: String,
    idNumber: String,
    expiryDate: String,
  },
  status: {
    type: String,
    enum: ["Verified", "Failed", "Pending"],
    default: "Pending",
  },
  confidence: {
    type: Number,
    default: 0,
  },
  ocrRaw: {
    type: String,
    default: "",
  },
  faceMatchResult: {
    type: String,
    enum: ["Pass", "Fail", "Error"],
    default: "Fail",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Verification = mongoose.model("Verification", verificationSchema);
