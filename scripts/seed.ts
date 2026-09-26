import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually if present
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });
}

import { Category } from '../src/lib/models/Category';
import { Product } from '../src/lib/models/Product';
import { User } from '../src/lib/models/User';
import { Order } from '../src/lib/models/Order';
import { hashPassword } from '../src/lib/auth';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../src/lib/seedData';

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vintagevault';
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('MongoDB connected successfully');

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
    console.log(`Created admin user: ${adminEmail}`);
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
    console.log('Created demo customer: rizwan@example.com');
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
    console.log('Created sample order VV10245');
  }

  console.log('\n--- SEED COMPLETE ---');
  console.log(`Total Categories in DB: ${allCategories.length} (New added: ${createdCategoriesCount})`);
  console.log(`Total Products in DB: ${allProducts.length} (New added: ${createdProductsCount})`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
