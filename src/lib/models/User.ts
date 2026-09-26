import mongoose, { Schema, Document } from 'mongoose';

export interface IUserAddress {
  _id?: string;
  fullName: string;
  phone: string;
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'user' | 'customer' | 'admin';
  avatar?: string;
  isActive?: boolean;
  addresses: IUserAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IUserAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    house: { type: String, required: true },
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'customer', 'admin'], default: 'user' },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    addresses: [AddressSchema],
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
