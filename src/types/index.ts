export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string; // Category slug or name
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
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  itemCount?: number;
  isActive?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Address {
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

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  _id: string;
  orderId: string;
  userId?: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  totalAmount: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  orderStatus: OrderStatus;
  whatsappSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses?: Address[];
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}
