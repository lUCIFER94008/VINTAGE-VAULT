import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/User';
import { comparePassword, hashPassword, signToken } from '@/lib/auth';

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
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // 1. Check if user exists by email or phone
    let user = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: email.trim() }],
    });

    // Auto-create/sync admin user if logging in as admin email and user doesn't exist yet
    if (normalizedEmail === envAdminEmail) {
      if (!user) {
        const hashedPassword = await hashPassword(envAdminPassword);
        user = await User.create({
          name: 'VINTAGE VAULT Admin',
          email: envAdminEmail,
          phone: '9876543210',
          password: hashedPassword,
          role: 'admin',
          isActive: true,
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Incorrect email or password.' },
        { status: 401 }
      );
    }

    // Compare password
    let isMatch = await comparePassword(password, user.password);

    // If password didn't match hash, but matches process.env.ADMIN_PASSWORD for admin user, update DB hash
    if (!isMatch && user.role === 'admin' && (normalizedEmail === envAdminEmail || user.email === envAdminEmail)) {
      if (password === envAdminPassword) {
        isMatch = true;
        user.password = await hashPassword(envAdminPassword);
        await user.save();
      }
    }

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
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
