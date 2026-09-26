import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/User';
import { comparePassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = String(email).toLowerCase().trim();
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@vintagevault.com').toLowerCase().trim();

    // 1. Check if user exists by email or phone
    const user = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: email.trim() }],
    });

    // 2. Reject admin account on customer login route
    if (user && (user.role === 'admin' || normalizedEmail === envAdminEmail)) {
      return NextResponse.json(
        { success: false, message: 'Please use the administrator login.' },
        { status: 403 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Incorrect email or password.' },
        { status: 401 }
      );
    }

    // 3. Compare password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Incorrect email or password.' },
        { status: 401 }
      );
    }

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = signToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful!',
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses || [],
      },
      token,
    });

    response.cookies.set('vv_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Customer login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
