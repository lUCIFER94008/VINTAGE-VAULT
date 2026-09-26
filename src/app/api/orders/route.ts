import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/lib/models/Order';
import { Product } from '@/lib/models/Product';
import { getUserFromRequest } from '@/lib/auth';
import { generateWhatsAppURL } from '@/lib/whatsapp';

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const filter: any = {};

    // If customer, restrict to user's orders or phone
    if (!user || user.role !== 'admin') {
      if (!user) {
        // Guest view requires orderId or phone via search parameter
        if (search) {
          filter.$or = [{ orderId: search }, { phone: search }];
        } else {
          return NextResponse.json(
            { success: false, message: 'Authentication required or provide Order ID/Phone.' },
            { status: 401 }
          );
        }
      } else {
        filter.$or = [{ userId: user.userId }, { phone: user.email }];
      }
    } else {
      // Admin filters
      if (status && status !== 'All') {
        filter.orderStatus = status;
      }
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
          { orderId: searchRegex },
          { customerName: searchRegex },
          { phone: searchRegex },
          { city: searchRegex },
        ];
      }
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    console.error('Get orders API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders.', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customerName, phone, address, city, state, pincode, landmark, userId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty.' },
        { status: 400 }
      );
    }

    if (!customerName || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, message: 'All delivery address fields are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Validate products & recalculate prices from MongoDB securely
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item.productId);
      if (!dbProduct) {
        return NextResponse.json(
          { success: false, message: `Product "${item.name}" no longer exists.` },
          { status: 400 }
        );
      }

      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Product "${dbProduct.name}" has insufficient stock (Only ${dbProduct.stock} left).`,
          },
          { status: 400 }
        );
      }

      const itemTotal = dbProduct.price * item.quantity;
      calculatedTotal += itemTotal;

      validatedItems.push({
        productId: dbProduct._id.toString(),
        name: dbProduct.name,
        image: dbProduct.images[0] || item.image,
        size: item.size || 'M',
        color: item.color || 'Black',
        quantity: item.quantity,
        price: dbProduct.price,
      });

      // Reduce product stock
      await Product.findByIdAndUpdate(dbProduct._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Generate Unique Order ID (e.g. VV + random 5 digits)
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `VV${randomNum}`;

    // Get user id if logged in
    const userPayload = getUserFromRequest(req);
    const effectiveUserId = userId || userPayload?.userId || '';

    const newOrder = await Order.create({
      orderId,
      userId: effectiveUserId,
      customerName,
      phone,
      items: validatedItems,
      totalAmount: calculatedTotal,
      address,
      city,
      state,
      pincode,
      landmark: landmark || '',
      orderStatus: 'Pending',
      whatsappSent: true,
    });

    // Generate WhatsApp URL
    const whatsappUrl = generateWhatsAppURL(newOrder.toObject());

    return NextResponse.json({
      success: true,
      message: 'Order created successfully!',
      order: newOrder,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error('Create order API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order.', error: error.message },
      { status: 500 }
    );
  }
}
