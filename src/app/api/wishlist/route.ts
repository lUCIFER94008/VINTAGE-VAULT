import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Wishlist } from '@/lib/models/Wishlist';
import { Product } from '@/lib/models/Product';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const wishlistDocs = await Wishlist.find({ userId: user.userId }).sort({ createdAt: -1 });
    const productIds = wishlistDocs.map((w) => w.productId);

    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    const serializedProducts = products.map((doc: any) => {
      const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
      return {
        ...obj,
        _id: obj._id ? obj._id.toString() : String(doc._id),
      };
    });

    return NextResponse.json({
      success: true,
      wishlist: serializedProducts,
      productIds,
    });
  } catch (error: any) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch wishlist', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Prevent duplicates
    const existing = await Wishlist.findOne({ userId: user.userId, productId });
    if (!existing) {
      await Wishlist.create({ userId: user.userId, productId });
    }

    return NextResponse.json({
      success: true,
      message: 'Product added to wishlist!',
    });
  } catch (error: any) {
    console.error('Add wishlist error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add to wishlist', error: error.message },
      { status: 500 }
    );
  }
}
