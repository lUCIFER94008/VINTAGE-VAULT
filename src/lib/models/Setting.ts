import mongoose, { Schema, Document } from 'mongoose';

export interface ISettingDocument extends Document {
  storeName: string;
  storeDescription: string;
  whatsappNumber: string;
  currency: string;
  currencySymbol: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISettingDocument>(
  {
    storeName: { type: String, default: 'VINTAGE VAULT' },
    storeDescription: { type: String, default: 'Timeless Style Always Wins. Premium Jerseys, Baggy & Everyday Essentials.' },
    whatsappNumber: { type: String, default: '' },
    currency: { type: String, default: 'INR' },
    currencySymbol: { type: String, default: '₹' },
    deliveryCharge: { type: Number, default: 0 },
    freeDeliveryThreshold: { type: Number, default: 999 },
  },
  { timestamps: true }
);

export const Setting = mongoose.models.Setting || mongoose.model<ISettingDocument>('Setting', SettingSchema);
