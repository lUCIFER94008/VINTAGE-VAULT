import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Address } from '@/lib/models/Address';
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
    const addresses = await Address.find({ userId: user.userId }).sort({ isDefault: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error: any) {
    console.error('Get addresses error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch addresses', error: error.message },
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
    const { fullName, phone, house, street, area, city, state, pincode, landmark, isDefault } = body;

    if (!fullName || !phone || !house || !street || !area || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, message: 'All main address fields are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    if (isDefault) {
      // Unset previous default address
      await Address.updateMany({ userId: user.userId }, { isDefault: false });
    }

    const newAddress = await Address.create({
      userId: user.userId,
      fullName,
      phone,
      house,
      street,
      area,
      city,
      state,
      pincode,
      landmark: landmark || '',
      isDefault: Boolean(isDefault),
    });

    return NextResponse.json({
      success: true,
      message: 'Address saved successfully!',
      address: newAddress,
    });
  } catch (error: any) {
    console.error('Create address error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save address', error: error.message },
      { status: 500 }
    );
  }
}
