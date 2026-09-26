import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log('Cloudinary cloud name configured:', !!cloudName);
  console.log('Cloudinary API key configured:', !!apiKey);
  console.log('Cloudinary API secret configured:', !!apiSecret);

  return Boolean(cloudName && apiKey && apiSecret && cloudName !== 'demo_cloud');
}

export async function uploadBufferToCloudinary(buffer: Buffer, folder: string = 'vintage-vault/products'): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary stream upload error:', error);
          reject(new Error(error.message || 'Cloudinary image upload failed.'));
        } else if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary did not return a valid secure URL.'));
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export async function uploadImageToCloudinary(fileString: string): Promise<string> {
  const trimmed = fileString.trim();

  // If it's already an HTTP/HTTPS URL, return it directly
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(trimmed, {
      folder: 'vintage-vault/products',
    });
    return uploadResponse.secure_url;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error.message || 'Failed to upload image file to Cloudinary.');
  }
}

export default cloudinary;
