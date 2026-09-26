import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/User';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields (Name, Email, Phone, Password) are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: 'customer',
      addresses: [],
    });

    const tokenPayload = {
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    };

    const token = signToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      message: 'Registration successful!',
      user: {
        _id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
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
    console.error('Register API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
