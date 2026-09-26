import mongoose, { Schema, Document } from 'mongoose';

export interface IAddressDocument extends Document {
  userId: string;
  fullName: string;
  phone: string;
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddressDocument>(
  {
    userId: { type: String, required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    house: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    landmark: { type: String, default: '', trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Address = mongoose.models.Address || mongoose.model<IAddressDocument>('Address', AddressSchema);
