import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/lib/models/User';
import { comparePassword, hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // 1. Verify required environment variables exist
    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'Admin authentication is not configured. Please configure the required server environment variables.',
        },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Admin email and password are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedInputEmail = String(email).toLowerCase().trim();
    const normalizedEnvEmail = adminEmail.toLowerCase().trim();

    // 2. Find admin user in MongoDB
    let adminUser = await User.findOne({
      $or: [
        { email: normalizedInputEmail, role: 'admin' },
        { email: normalizedEnvEmail, role: 'admin' },
      ],
    });

    // 3. Auto-seed/sync admin user in MongoDB if not existing yet
    if (!adminUser) {
      // Check if input email matches configured ADMIN_EMAIL or if no admin exists
      const anyAdmin = await User.findOne({ role: 'admin' });
      if (!anyAdmin || normalizedInputEmail === normalizedEnvEmail) {
        const hashedPassword = await hashPassword(adminPassword);
        adminUser = await User.create({
          name: 'VINTAGE VAULT Admin',
          email: normalizedEnvEmail,
          phone: '9876543210',
          password: hashedPassword,
          role: 'admin',
          isActive: true,
        });
      }
    }

    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // 4. Verify password with bcrypt
    let isMatch = await comparePassword(password, adminUser.password);

    // Backup check: if password didn't match stored hash, but matches process.env.ADMIN_PASSWORD, update stored hash
    if (!isMatch && (normalizedInputEmail === normalizedEnvEmail || adminUser.email === normalizedEnvEmail)) {
      if (password === adminPassword) {
        isMatch = true;
        adminUser.password = await hashPassword(adminPassword);
        await adminUser.save();
      }
    }

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // 5. Create secure JWT token with role = 'admin'
    const tokenPayload = {
      userId: adminUser._id.toString(),
      email: adminUser.email,
      role: 'admin' as const,
      name: adminUser.name,
    };

    const token = signToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful!',
      user: {
        _id: adminUser._id.toString(),
        name: adminUser.name,
        email: adminUser.email,
        phone: adminUser.phone,
        role: adminUser.role,
        addresses: adminUser.addresses || [],
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
    console.error('Admin login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during admin authentication.' },
      { status: 500 }
    );
  }
}
