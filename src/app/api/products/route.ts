import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { Category } from '@/lib/models/Category';
import { requireAdmin } from '@/lib/auth';
import { ensureCategoryMigration } from '@/lib/categorySync';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    await ensureCategoryMigration();

    const { searchParams } = new URL(req.url);
    let category = searchParams.get('category');
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
      if (category === 'jeans') category = 'baggy';
      if (category === 'caps') category = 'headwear';
      if (category === 'glasses') category = 'accessories';
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

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Product name is required.' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json(
        { success: false, message: 'Category is required.' },
        { status: 400 }
      );
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json(
        { success: false, message: 'Valid sale price is required.' },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, message: 'At least one product image is required.' },
        { status: 400 }
      );
    }

    const hasBase64Image = images.some((img: any) => String(img).trim().startsWith('data:image/'));
    if (hasBase64Image) {
      return NextResponse.json(
        {
          success: false,
          message: 'Base64 image data is not allowed in product payload. Please upload image files to Cloudinary or provide HTTP image URLs.',
        },
        { status: 400 }
      );
    }

    const invalidUrl = images.some((img: any) => !String(img).trim().startsWith('http://') && !String(img).trim().startsWith('https://'));
    if (invalidUrl) {
      return NextResponse.json(
        {
          success: false,
          message: 'All product images must be valid HTTP or HTTPS URLs.',
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const trimmedName = name.trim();
    const trimmedCategory = category.trim();

    // Verify category exists or normalize
    const categoryDoc = await Category.findOne({
      $or: [
        { slug: trimmedCategory.toLowerCase() },
        { name: new RegExp(`^${trimmedCategory}$`, 'i') },
      ],
    });

    const categorySlug = categoryDoc ? categoryDoc.slug : trimmedCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Safe unique slug generation
    let baseSlug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!baseSlug) {
      baseSlug = 'product-' + Date.now();
    }

    let uniqueSlug = baseSlug;
    let existingProduct = await Product.findOne({ slug: uniqueSlug });
    let counter = 1;
    while (existingProduct) {
      uniqueSlug = `${baseSlug}-${counter}`;
      existingProduct = await Product.findOne({ slug: uniqueSlug });
      counter++;
    }

    // Safe numerical conversions
    const numOriginalPrice = Number(originalPrice && Number(originalPrice) >= numPrice ? originalPrice : numPrice);
    const numStock = isNaN(Number(stock)) ? 0 : Math.max(0, Number(stock));

    let calculatedDiscount = 0;
    if (discount !== undefined && !isNaN(Number(discount))) {
      calculatedDiscount = Math.max(0, Math.min(100, Number(discount)));
    } else if (numOriginalPrice > numPrice) {
      calculatedDiscount = Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100);
    }

    // Clean arrays
    const cleanSizes = Array.isArray(sizes) && sizes.length > 0 ? sizes.map(s => String(s).trim()) : ['S', 'M', 'L', 'XL'];
    const cleanColors = Array.isArray(colors) && colors.length > 0 ? colors.map(c => String(c).trim()) : ['Black'];
    const cleanImages = images.map(img => String(img).trim()).filter(Boolean);

    const product = await Product.create({
      name: trimmedName,
      slug: uniqueSlug,
      category: categorySlug,
      description: description ? String(description).trim() : trimmedName,
      price: numPrice,
      originalPrice: numOriginalPrice,
      discount: calculatedDiscount,
      stock: numStock,
      sizes: cleanSizes,
      colors: cleanColors,
      images: cleanImages,
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      rating: 4.8,
      reviewsCount: 1,
    });

    // Revalidate relevant pages
    try {
      revalidatePath('/products');
      revalidatePath('/admin/products');
      revalidatePath('/');
      revalidatePath(`/category/${categorySlug}`);
    } catch (e) {
      // Ignore cache revalidation errors if any
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully!',
        product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create product API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create product.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
