import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Review } from '@/lib/models/Review';
import { Product } from '@/lib/models/Product';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const reviews = await Review.find({ productId: id, isApproved: true }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error: any) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required to post a review.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { rating, comment, userName } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5.' },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Review comment cannot be empty.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newReview = await Review.create({
      userId: user.userId,
      userName: userName || user.email.split('@')[0],
      productId: id,
      rating: Number(rating),
      comment,
      isApproved: true,
    });

    // Update Product average rating and review count
    const allProductReviews = await Review.find({ productId: id, isApproved: true });
    const totalRating = allProductReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / allProductReviews.length).toFixed(1));

    await Product.findByIdAndUpdate(id, {
      rating: avgRating,
      reviewsCount: allProductReviews.length,
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully!',
      review: newReview,
    });
  } catch (error: any) {
    console.error('Post review error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit review', error: error.message },
      { status: 500 }
    );
  }
}
