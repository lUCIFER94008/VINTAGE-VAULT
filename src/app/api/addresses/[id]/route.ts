import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Address } from '@/lib/models/Address';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    await connectToDatabase();

    if (body.isDefault) {
      await Address.updateMany({ userId: user.userId }, { isDefault: false });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: id, userId: user.userId },
      { $set: body },
      { new: true }
    );

    if (!updatedAddress) {
      return NextResponse.json(
        { success: false, message: 'Address not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully!',
      address: updatedAddress,
    });
  } catch (error: any) {
    console.error('Update address error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update address', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectToDatabase();

    const deleted = await Address.findOneAndDelete({ _id: id, userId: user.userId });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Address not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully!',
    });
  } catch (error: any) {
    console.error('Delete address error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete address', error: error.message },
      { status: 500 }
    );
  }
}
