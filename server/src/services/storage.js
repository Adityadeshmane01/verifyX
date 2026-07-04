import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log("Cloudinary cloud storage service configured successfully.");
} else {
  console.log("Cloudinary credentials missing in .env. Defaulting to local disk storage cache.");
}

/**
 * Uploads a local file to Cloudinary.
 * If successful, deletes the local file and returns the cloud URL.
 * If Cloudinary is not configured or upload fails, returns null (fallback to local URL).
 * 
 * @param {string} filePath - Absolute path to local file
 * @returns {Promise<string|null>} - Cloud URL or null
 */
export async function uploadToCloud(filePath) {
  if (!isCloudinaryConfigured) {
    return null;
  }
  
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "verifyx_verifications"
    });
    
    // Clean up local temp file once hosted in the cloud
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupErr) {
      console.warn("Could not delete local temp file after cloud upload:", cleanupErr);
    }
    
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed, falling back to local storage:", error);
    return null;
  }
}
