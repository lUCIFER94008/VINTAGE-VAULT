import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Category } from '@/lib/models/Category';
import { requireAdmin } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();

    await connectToDatabase();

    if (body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const category = await Category.findByIdAndUpdate(id, body, { new: true });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully!',
      category,
    });
  } catch (error: any) {
    console.error('Update category API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update category.', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { id } = await params;
    await connectToDatabase();

    await Category.findByIdAndUpdate(id, { isActive: false });

    return NextResponse.json({
      success: true,
      message: 'Category deactivated successfully.',
    });
  } catch (error: any) {
    console.error('Delete category API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete category.', error: error.message },
      { status: 500 }
    );
  }
}
