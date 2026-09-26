import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImageToCloudinary(fileString: string): Promise<string> {
  // If Cloudinary isn't configured, fallback gracefully to data URL or demo host
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'demo_cloud') {
    // Return data URL or placeholder directly if provided
    return fileString;
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileString, {
      folder: 'vintagevault/products',
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Fallback to original string if upload fails
    return fileString;
  }
}

export default cloudinary;
