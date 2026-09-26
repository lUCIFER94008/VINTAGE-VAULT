import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Wishlist } from '@/lib/models/Wishlist';
import { getUserFromRequest } from '@/lib/auth';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { productId } = await params;
    await connectToDatabase();

    await Wishlist.findOneAndDelete({ userId: user.userId, productId });

    return NextResponse.json({
      success: true,
      message: 'Product removed from wishlist!',
    });
  } catch (error: any) {
    console.error('Delete wishlist error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove from wishlist', error: error.message },
      { status: 500 }
    );
  }
}
