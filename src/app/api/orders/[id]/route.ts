import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/lib/models/Order';
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

    let order;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error('Get single order API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order details.', error: error.message },
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
    const { orderStatus } = await req.json();

    if (!orderStatus) {
      return NextResponse.json(
        { success: false, message: 'Order status is required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let order;
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found.' },
        { status: 404 }
      );
    }

    // If order status changes to Cancelled, restore stock
    if (orderStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.orderStatus = orderStatus;
    await order.save();

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${orderStatus}.`,
      order,
    });
  } catch (error: any) {
    console.error('Update order status API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update order status.', error: error.message },
      { status: 500 }
    );
  }
}
