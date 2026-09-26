import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImageToCloudinary(fileString: string): Promise<string> {
  const trimmed = fileString.trim();

  // If it's already an HTTP/HTTPS URL, return it directly
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Check if Cloudinary is configured
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret || cloudName === 'demo_cloud') {
    throw new Error('Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing or invalid.');
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(trimmed, {
      folder: 'vintagevault/products',
    });
    return uploadResponse.secure_url;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error.message || 'Failed to upload image file to Cloudinary.');
  }
}

export default cloudinary;
