import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import cloudinary from "@/lib/cloudinary";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const isAdmin = searchParams.get('admin') === 'true';
    
    // DEBUG LOGS
    console.log("CATEGORY:", category);
    console.log("IS_ADMIN:", isAdmin);
    
    let query = {};
    if (category && category !== "undefined" && category !== "null") {
      query.category = category;
    }

    // FILTER BY AVAILABILITY (Users only)
    if (!isAdmin) {
      query.available = true;
    }

    console.log("FINAL QUERY:", query);

    const products = await Product.find(query).sort({ createdAt: -1 });
    console.log("TOTAL PRODUCTS FOUND:", products.length);
    
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.formData();

    const name = data.get("name");
    const price = data.get("price");
    const description = data.get("description");
    const category = data.get("category");
    const sizesStr = data.get("sizes");
    const files = data.getAll("file");

    const sizes = sizesStr ? JSON.parse(sizesStr) : [];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Please select at least one image" }, { status: 400 });
    }

    const imageUrls = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "vintage-vault" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });
      imageUrls.push(uploadRes.secure_url);
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      images: imageUrls,
      sizes,
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
