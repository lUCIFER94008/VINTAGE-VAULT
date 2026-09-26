import mongoose, { Schema, Document } from 'mongoose';

export interface ICouponDocument extends Document {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumAmount: number;
  maximumDiscount?: number;
  expiryDate?: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICouponDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discountValue: { type: Number, required: true, min: 0 },
    minimumAmount: { type: Number, default: 0 },
    maximumDiscount: { type: Number },
    expiryDate: { type: Date },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon = mongoose.models.Coupon || mongoose.model<ICouponDocument>('Coupon', CouponSchema);
