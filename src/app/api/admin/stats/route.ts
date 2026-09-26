import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/lib/models/Order';
import { Product } from '@/lib/models/Product';
import { User } from '@/lib/models/User';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();

    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      salesResult,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments({}),
      Product.countDocuments({}),
      User.countDocuments({ role: { $in: ['user', 'customer'] } }),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Order.countDocuments({ orderStatus: 'Confirmed' }),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find({}).sort({ createdAt: -1 }).limit(5),
    ]);

    const totalSalesValue = salesResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        totalSalesValue,
      },
      recentOrders,
    });
  } catch (error: any) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to calculate admin stats', error: error.message },
      { status: 500 }
    );
  }
}
