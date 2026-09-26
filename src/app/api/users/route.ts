import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Order } from '@/lib/models/Order';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();

    const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });

    // Calculate customer metrics (total orders & total spent)
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const userOrders = await Order.find({
          $or: [{ userId: u._id.toString() }, { phone: u.phone }, { customerName: u.name }],
        });

        const totalSpent = userOrders.reduce((sum, ord) => sum + ord.totalAmount, 0);
        const lastOrder = userOrders.length > 0 ? userOrders[0].createdAt : null;

        return {
          ...u.toObject(),
          totalOrders: userOrders.length,
          totalSpent,
          lastOrder,
        };
      })
    );

    return NextResponse.json({
      success: true,
      customers: usersWithStats,
    });
  } catch (error: any) {
    console.error('Get users API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users.', error: error.message },
      { status: 500 }
    );
  }
}
