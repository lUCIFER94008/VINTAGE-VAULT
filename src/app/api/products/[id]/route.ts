import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found.' },
        { status: 404 }
      );
    }

    const obj = typeof product.toObject === 'function' ? product.toObject() : product;
    const serializedProduct = {
      ...obj,
      _id: obj._id ? obj._id.toString() : String(product._id),
    };

    return NextResponse.json({
      success: true,
      product: serializedProduct,
    });
  } catch (error: any) {
    console.error('Get single product API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product.', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();

    await connectToDatabase();

    if (body.price && body.originalPrice) {
      body.discount = Math.round(((body.originalPrice - body.price) / body.originalPrice) * 100);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully!',
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error('Update product API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product.', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    await connectToDatabase();

    // Prefer soft delete by default or hard delete if query parameter hard=true
    const { searchParams } = new URL(req.url);
    const isHard = searchParams.get('hard') === 'true';

    if (isHard) {
      await Product.findByIdAndDelete(id);
    } else {
      await Product.findByIdAndUpdate(id, { isActive: false });
    }

    return NextResponse.json({
      success: true,
      message: isHard ? 'Product deleted permanently.' : 'Product deactivated successfully.',
    });
  } catch (error: any) {
    console.error('Delete product API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product.', error: error.message },
      { status: 500 }
    );
  }
}
