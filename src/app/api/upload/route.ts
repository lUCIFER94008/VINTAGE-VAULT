import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const { image } = body; // Base64 data URL or string

    if (!image) {
      return NextResponse.json(
        { success: false, message: 'Image data is required.' },
        { status: 400 }
      );
    }

    const imageUrl = await uploadImageToCloudinary(image);

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error: any) {
    console.error('Image upload API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload image.', error: error.message },
      { status: 500 }
    );
  }
}
