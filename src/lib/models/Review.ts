import mongoose, { Schema, Document } from 'mongoose';

export interface IReviewDocument extends Document {
  userId: string;
  userName?: string;
  productId: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    userId: { type: String, required: true, index: true },
    userName: { type: String, default: 'Anonymous Customer' },
    productId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: true },
    verifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ productId: 1, userId: 1 });

export const Review = mongoose.models.Review || mongoose.model<IReviewDocument>('Review', ReviewSchema);
