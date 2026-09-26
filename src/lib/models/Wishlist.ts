import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistDocument extends Document {
  userId: string;
  productId: string;
  createdAt: Date;
}

const WishlistSchema = new Schema<IWishlistDocument>(
  {
    userId: { type: String, required: true, index: true },
    productId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicate wishlist items per user
WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Wishlist = mongoose.models.Wishlist || mongoose.model<IWishlistDocument>('Wishlist', WishlistSchema);
