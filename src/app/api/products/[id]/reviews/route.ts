import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Review } from '@/lib/models/Review';
import { Product } from '@/lib/models/Product';
import { User } from '@/lib/models/User';
import { Order } from '@/lib/models/Order';
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
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json(
        { success: false, message: 'Authentication required to post a review.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { rating, comment } = body;

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { success: false, message: 'Please select a rating between 1 and 5 stars.' },
        { status: 400 }
      );
    }

    const trimmedComment = typeof comment === 'string' ? comment.trim() : '';
    if (trimmedComment.length < 5) {
      return NextResponse.json(
        { success: false, message: 'Review comment must be at least 5 characters long.' },
        { status: 400 }
      );
    }

    if (trimmedComment.length > 500) {
      return NextResponse.json(
        { success: false, message: 'Review comment cannot exceed 500 characters.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Fetch exact user details from database
    const dbUser = await User.findById(userPayload.userId).select('name email phone');
    const userName = dbUser?.name || userPayload.email?.split('@')[0] || 'Authenticated Customer';

    // Verify if customer has purchased this product
    const queryConditions: any[] = [{ userId: userPayload.userId }];
    if (dbUser?.phone) {
      queryConditions.push({ phone: dbUser.phone });
    }
    const orderExists = await Order.findOne({
      $or: queryConditions,
      'items.productId': id,
      orderStatus: { $ne: 'Cancelled' },
    });
    const verifiedPurchase = !!orderExists;

    // Check if review already exists for this user and product
    let review = await Review.findOne({ productId: id, userId: userPayload.userId });

    if (review) {
      review.rating = numRating;
      review.comment = trimmedComment;
      review.userName = userName;
      review.verifiedPurchase = verifiedPurchase;
      review.isApproved = true;
      await review.save();
    } else {
      review = await Review.create({
        userId: userPayload.userId,
        userName,
        productId: id,
        rating: numRating,
        comment: trimmedComment,
        verifiedPurchase,
        isApproved: true,
      });
    }

    // Recalculate average rating and review count
    const allProductReviews = await Review.find({ productId: id, isApproved: true });
    const totalRating = allProductReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allProductReviews.length > 0 ? Number((totalRating / allProductReviews.length).toFixed(1)) : 5.0;

    await Product.findByIdAndUpdate(id, {
      rating: avgRating,
      reviewsCount: allProductReviews.length,
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully!',
      review,
      rating: avgRating,
      reviewsCount: allProductReviews.length,
    });
  } catch (error: any) {
    console.error('Post review error:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to submit your review. Please try again.', error: error.message },
      { status: 500 }
    );
  }
}
