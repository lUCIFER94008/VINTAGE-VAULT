import { NextRequest, NextResponse } from 'next/server';
import { isCloudinaryConfigured, uploadBufferToCloudinary, uploadImageToCloudinary } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cloudinary is not configured',
        },
        { status: 500 }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    let imageUrl = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = (formData.get('file') || formData.get('image')) as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, message: 'No image file received' },
          { status: 400 }
        );
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: 'Image is too large. Please upload a smaller image.' },
          { status: 400 }
        );
      }

      // Validate image format
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        return NextResponse.json(
          { success: false, message: 'Unsupported image format' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      imageUrl = await uploadBufferToCloudinary(buffer, 'vintage-vault/products');
    } else if (contentType.includes('application/json')) {
      const body = await req.json().catch(() => ({}));
      const { image } = body;

      if (!image || typeof image !== 'string') {
        return NextResponse.json(
          { success: false, message: 'No image data received' },
          { status: 400 }
        );
      }

      const trimmed = image.trim();
      if (trimmed.startsWith('data:image/')) {
        const matches = trimmed.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (matches && matches[2]) {
          const buffer = Buffer.from(matches[2], 'base64');
          imageUrl = await uploadBufferToCloudinary(buffer, 'vintage-vault/products');
        } else {
          return NextResponse.json(
            { success: false, message: 'Invalid base64 image data' },
            { status: 400 }
          );
        }
      } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        imageUrl = await uploadImageToCloudinary(trimmed);
      } else {
        return NextResponse.json(
          { success: false, message: 'Invalid image URL or format' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Unsupported content-type header' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error: any) {
    console.error('Image upload API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Cloudinary image upload failed',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
