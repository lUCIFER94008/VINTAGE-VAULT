import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User account not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Auth Me API error:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving user session.' },
      { status: 500 }
    );
  }
}
