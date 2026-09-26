import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Review } from '@/lib/models/Review';
import { Product } from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id, reviewId } = await params;
    await connectToDatabase();

    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Review not found.' },
        { status: 404 }
      );
    }

    // Recalculate rating & review count for product
    const allProductReviews = await Review.find({ productId: id, isApproved: true });
    const totalRating = allProductReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating =
      allProductReviews.length > 0
        ? Number((totalRating / allProductReviews.length).toFixed(1))
        : 5.0;

    await Product.findByIdAndUpdate(id, {
      rating: avgRating,
      reviewsCount: allProductReviews.length,
    });

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully.',
    });
  } catch (error: any) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete review.', error: error.message },
      { status: 500 }
    );
  }
}
