import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Category } from '@/lib/models/Category';
import { Product } from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth';
import { ensureCategoryMigration } from '@/lib/categorySync';

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

export async function GET() {
  try {
    await connectToDatabase();
    await ensureCategoryMigration();
    const categories = await Category.find({ isActive: true });

    // Count products per category & convert _id to string
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat: any) => {
        const obj = typeof cat.toObject === 'function' ? cat.toObject() : cat;
        const count = await Product.countDocuments({ category: cat.slug, isActive: true });
        return {
          ...obj,
          _id: obj._id ? obj._id.toString() : String(cat._id),
          itemCount: count,
        };
      })
    );

    // Sort according to target category order
    categoriesWithCounts.sort((a, b) => {
      const idxA = CATEGORY_ORDER.indexOf(a.slug);
      const idxB = CATEGORY_ORDER.indexOf(b.slug);
      const posA = idxA === -1 ? 99 : idxA;
      const posB = idxB === -1 ? 99 : idxB;
      return posA - posB;
    });

    return NextResponse.json(
      {
        success: true,
        categories: categoriesWithCounts,
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
