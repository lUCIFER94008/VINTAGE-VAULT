import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// DELETE a product
export async function DELETE(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// UPDATE (Full)
export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await Product.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// UPDATE AVAILABILITY (Toggle)
export async function PATCH(req, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await Product.findByIdAndUpdate(
      id,
      { available: body.available },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
