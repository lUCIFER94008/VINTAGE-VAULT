import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Category } from '@/lib/models/Category';
import { Product } from '@/lib/models/Product';
import { User } from '@/lib/models/User';
import { Order } from '@/lib/models/Order';
import { hashPassword, requireAdmin } from '@/lib/auth';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/seedData';

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: 'Unrestricted GET seed is disabled for security. Please use authenticated POST /api/seed as an admin.',
    },
    { status: 405 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse } = requireAdmin(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();

    let createdCategoriesCount = 0;
    let createdProductsCount = 0;

    // 1. Seed Categories safely (upsert by slug)
    for (const cat of INITIAL_CATEGORIES) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        await Category.create(cat);
        createdCategoriesCount++;
      }
    }

    // 2. Seed Products safely (upsert by slug)
    for (const prod of INITIAL_PRODUCTS) {
      const existing = await Product.findOne({ slug: prod.slug });
      if (!existing) {
        await Product.create(prod);
        createdProductsCount++;
      }
    }

    const allProducts = await Product.find({});
    const allCategories = await Category.find({});

    // 3. Seed Admin User safely
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vintagevault.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const adminPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123');
      adminUser = await User.create({
        name: 'VINTAGE VAULT Admin',
        email: adminEmail,
        phone: '9876543210',
        password: adminPassword,
        role: 'admin',
        addresses: [
          {
            fullName: 'VINTAGE VAULT Store Admin',
            phone: '9876543210',
            house: 'Vault HQ, Floor 4',
            street: 'Fashion Avenue',
            area: 'MG Road',
            city: 'Kochi',
            state: 'Kerala',
            pincode: '682001',
            landmark: 'Opposite Metro Station',
            isDefault: true,
          },
        ],
      });
    }

    // 4. Seed Demo Customer safely
    let demoCustomer = await User.findOne({ email: 'rizwan@example.com' });
    if (!demoCustomer) {
      const customerPassword = await hashPassword('customer123');
      demoCustomer = await User.create({
        name: 'Mohammed Rizwan',
        email: 'rizwan@example.com',
        phone: '9876543210',
        password: customerPassword,
        role: 'user',
        addresses: [
          {
            fullName: 'Mohammed Rizwan',
            phone: '9876543210',
            house: 'House No. 12',
            street: 'Main Street',
            area: 'Marine Drive',
            city: 'Kochi',
            state: 'Kerala',
            pincode: '683001',
            landmark: 'Near Clock Tower',
            isDefault: true,
          },
        ],
      });
    }

    // 5. Seed Demo Orders safely
    const existingOrder1 = await Order.findOne({ orderId: 'VV10245' });
    if (!existingOrder1 && allProducts.length >= 7) {
      await Order.create({
        orderId: 'VV10245',
        userId: demoCustomer._id.toString(),
        customerName: 'Mohammed Rizwan',
        phone: '9876543210',
        items: [
          {
            productId: allProducts[0]._id.toString(),
            name: allProducts[0].name,
            image: allProducts[0].images[0],
            size: 'L',
            color: allProducts[0].colors[0] || 'White',
            quantity: 1,
            price: allProducts[0].price,
          },
          {
            productId: allProducts[6]._id.toString(),
            name: allProducts[6].name,
            image: allProducts[6].images[0],
            size: '32',
            color: allProducts[6].colors[0] || 'Indigo',
            quantity: 1,
            price: allProducts[6].price,
          },
        ],
        totalAmount: allProducts[0].price + allProducts[6].price,
        address: 'House No. 12, Main Street',
        city: 'Kochi',
        state: 'Kerala',
        pincode: '683001',
        landmark: 'Near Clock Tower',
        orderStatus: 'Confirmed',
        whatsappSent: true,
      });
    }

    const existingOrder2 = await Order.findOne({ orderId: 'VV10246' });
    if (!existingOrder2 && allProducts.length >= 31) {
      await Order.create({
        orderId: 'VV10246',
        userId: demoCustomer._id.toString(),
        customerName: 'Ananya Sharma',
        phone: '9812345678',
        items: [
          {
            productId: allProducts[30]._id.toString(),
            name: allProducts[30].name,
            image: allProducts[30].images[0],
            size: 'Standard',
            color: allProducts[30].colors[0] || 'Black',
            quantity: 1,
            price: allProducts[30].price,
          },
        ],
        totalAmount: allProducts[30].price,
        address: '42 Park Street, Flat 3B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        landmark: 'Behind St. Paul Church',
        orderStatus: 'Delivered',
        whatsappSent: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database check & seed process completed successfully!',
      data: {
        totalCategories: allCategories.length,
        newCategoriesCreated: createdCategoriesCount,
        totalProducts: allProducts.length,
        newProductsCreated: createdProductsCount,
      },
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed database.', error: error.message },
      { status: 500 }
    );
  }
}
