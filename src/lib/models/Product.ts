import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  category: string; // Slug or Name of Category
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
  sizes: string[];
  colors: string[];
  images: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sizes: [{ type: String, trim: true }],
    colors: [{ type: String, trim: true }],
    images: [{ type: String, required: true }],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 12 },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', category: 'text', description: 'text' });

export const Product = mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
