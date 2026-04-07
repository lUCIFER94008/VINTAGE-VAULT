import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// DELETE a product
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const id = params.id;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT (Full Update)
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const id = params.id;
    const data = await req.json();
    
    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH (Partial Update - e.g., Availability Toggle)
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const id = params.id;
    const { available } = await req.json();
    
    const updatedProduct = await Product.findByIdAndUpdate(id, { available }, { new: true });
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
