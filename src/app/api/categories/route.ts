import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Category } from '@/lib/models/Category';
import { Product } from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth';
import { ensureCategoryMigration } from '@/lib/categorySync';

import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CATEGORY_ORDER = [
  '5-sleeve-jerseys',
  'baggy',
  'full-sleeve-stripes',
  'socks',
  'headwear',
  'accessories',
  'shorts',
  't-shirts',
  'track-pant',
];

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await ensureCategoryMigration();

    const { searchParams } = new URL(req.url);
    const includeCounts = searchParams.get('includeCounts') === 'true';

    // Lean query retrieving only necessary fields
    const categories = await Category.find({ isActive: true })
      .select('_id name slug image description isActive')
      .lean();

    let categoriesResult: any[] = [];

    if (includeCounts) {
      categoriesResult = await Promise.all(
        categories.map(async (cat: any) => {
          const count = await Product.countDocuments({ category: cat.slug, isActive: true });
          return {
            ...cat,
            _id: cat._id ? cat._id.toString() : String(cat._id),
            itemCount: count,
          };
        })
      );
    } else {
      categoriesResult = categories.map((cat: any) => ({
        ...cat,
        _id: cat._id ? cat._id.toString() : String(cat._id),
      }));
    }

    // Sort according to target category order
    categoriesResult.sort((a, b) => {
      const idxA = CATEGORY_ORDER.indexOf(a.slug);
      const idxB = CATEGORY_ORDER.indexOf(b.slug);
      const posA = idxA === -1 ? 99 : idxA;
      const posB = idxB === -1 ? 99 : idxB;
      return posA - posB;
    });

    return NextResponse.json(
      {
        success: true,
        categories: categoriesResult,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Get categories API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories.', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const { name, description, image } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Category name is required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '',
      isActive: true,
    });

    try {
      revalidatePath('/');
      revalidatePath('/products');
      revalidatePath('/admin/categories');
    } catch (e) {
      // Ignore cache revalidation errors if any
    }

    return NextResponse.json({
      success: true,
      message: 'Category created successfully!',
      category,
    });
  } catch (error: any) {
    console.error('Create category API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create category.', error: error.message },
      { status: 500 }
    );
  }
}
