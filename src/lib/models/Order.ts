import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface IOrderDocument extends Document {
  orderId: string;
  userId?: string;
  customerName: string;
  phone: string;
  items: IOrderItem[];
  totalAmount: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  orderStatus:
    | 'Pending'
    | 'Confirmed'
    | 'Packed'
    | 'Shipped'
    | 'Out for Delivery'
    | 'Delivered'
    | 'Cancelled';
  whatsappSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, default: '' },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String, default: '' },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Pending',
    },
    whatsappSent: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
