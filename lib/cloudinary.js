import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer for in-memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Helper function to upload file buffer to Cloudinary
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "pakamani-images" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default uploadFromBuffer;
