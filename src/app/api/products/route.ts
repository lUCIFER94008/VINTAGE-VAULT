import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isFeatured = searchParams.get('featured');
    const isNewArrival = searchParams.get('newArrival');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort') || 'newest';

    const filter: any = {};

    // For customers, show active products unless explicitly requested by admin
    if (!searchParams.get('includeInactive')) {
      filter.isActive = true;
    }

    if (category) {
      filter.category = category;
    }

    if (isFeatured === 'true') {
      filter.isFeatured = true;
    }

    if (isNewArrival === 'true') {
      filter.isNewArrival = true;
    }

    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (size) {
      filter.sizes = { $in: [size] };
    }

    if (color) {
      filter.colors = { $in: [new RegExp(color, 'i')] };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'popular') sortOptions = { rating: -1, reviewsCount: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };

    const products = await Product.find(filter).sort(sortOptions);

    const serializedProducts = products.map((doc: any) => {
      const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
      return {
        ...obj,
        _id: obj._id ? obj._id.toString() : String(doc._id),
      };
    });

    return NextResponse.json({
      success: true,
      count: serializedProducts.length,
      products: serializedProducts,
    });
  } catch (error: any) {
    console.error('Get products API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const {
      name,
      category,
      description,
      price,
      originalPrice,
      discount,
      stock,
      sizes,
      colors,
      images,
      isFeatured,
      isNewArrival,
      isActive,
    } = body;

    if (!name || !category || !price || !images || images.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Name, Category, Price, and at least one Image are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const calculatedDiscount = discount !== undefined ? discount : Math.round(((originalPrice - price) / originalPrice) * 100);

    const product = await Product.create({
      name,
      slug,
      category,
      description: description || '',
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      discount: calculatedDiscount,
      stock: Number(stock || 0),
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      colors: colors || ['Black'],
      images,
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      rating: 4.8,
      reviewsCount: 1,
    });

    return NextResponse.json({
      success: true,
      message: 'Product created successfully!',
      product,
    });
  } catch (error: any) {
    console.error('Create product API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product.', error: error.message },
      { status: 500 }
    );
  }
}
