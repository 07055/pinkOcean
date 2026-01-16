import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Set up the Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => {
    // Determine if it's a video or image based on mimetype
    const isVideo = file.mimetype.includes("video");
    
    return {
      folder: "pink_ocean_assets",
      resource_type: isVideo ? "video" : "image", 
      allowed_formats: ["jpg", "png", "jpeg", "mp4", "mov", "gif"],
      public_id: `po-${Date.now()}-${file.originalname.split('.')[0]}`,
      // --- SIZE PROTECTION ---
      transformation: [
        { width: 1080, crop: "limit" }, // Prevents massive 4K uploads
        { quality: "auto:eco" }         // Compresses to save your credits
      ],
    };
  },
});

// 3. The actual Multer Middleware
export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // Limit to 50MB for video support
  }
});

