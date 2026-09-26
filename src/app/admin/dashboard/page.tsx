'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/whatsapp';
import { Order } from '@/types';
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  Truck,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [customersCount, setCustomersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const [ordRes, prodRes, custRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/products?includeInactive=true'),
          fetch('/api/users'),
        ]);

        const ordData = await ordRes.json();
        const prodData = await prodRes.json();
        const custData = await custRes.json();

        if (ordData.success && Array.isArray(ordData.orders)) setOrders(ordData.orders);
        if (prodData.success) setProductsCount(prodData.count || 0);
        if (custData.success && Array.isArray(custData.customers)) setCustomersCount(custData.customers.length);
      } catch (err) {
        console.error('Error fetching dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardStats();
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
  const confirmedOrders = orders.filter((o) => o.orderStatus === 'Confirmed').length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const totalSalesValue = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const recentOrders = orders.slice(0, 6);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Confirmed':
      case 'Packed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-[#F8F8F8] text-[#666666] border-[#EAEAEA]';
    }
  };

  return (
    <div className="bg-white space-y-8">
      {/* Dashboard Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#25D366] uppercase">
            REAL-TIME MONGODB ANALYTICS
          </span>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
            ADMIN DASHBOARD
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-[#111111] hover:bg-zinc-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <span>+ ADD PRODUCT</span>
        </Link>
      </div>

      {/* METRICS SUMMARY CARDS GRID (WHITE CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL ORDERS */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAEAEA] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#666666]">
            <span className="text-xs font-bold uppercase tracking-wider">TOTAL ORDERS</span>
            <ShoppingBag className="w-4 h-4 text-[#111111]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#111111] font-mono">{totalOrders}</p>
        </div>

        {/* TOTAL SALES VALUE */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAEAEA] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#666666]">
            <span className="text-xs font-bold uppercase tracking-wider">SALES VALUE</span>
            <DollarSign className="w-4 h-4 text-[#25D366]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#111111] font-mono">
            {formatCurrency(totalSalesValue)}
          </p>
        </div>

        {/* TOTAL PRODUCTS */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAEAEA] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#666666]">
            <span className="text-xs font-bold uppercase tracking-wider">TOTAL PRODUCTS</span>
            <Package className="w-4 h-4 text-[#111111]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#111111] font-mono">{productsCount}</p>
        </div>

        {/* TOTAL CUSTOMERS */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAEAEA] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[#666666]">
            <span className="text-xs font-bold uppercase tracking-wider">CUSTOMERS</span>
            <Users className="w-4 h-4 text-[#111111]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#111111] font-mono">{customersCount}</p>
        </div>
      </div>

      {/* SECONDARY BREAKDOWN METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#666666] font-bold uppercase">PENDING ORDERS</span>
            <p className="text-xl font-black text-amber-600 font-mono mt-1">{pendingOrders}</p>
          </div>
          <Clock className="w-6 h-6 text-amber-500" />
        </div>

        <div className="p-5 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#666666] font-bold uppercase">CONFIRMED ORDERS</span>
            <p className="text-xl font-black text-blue-600 font-mono mt-1">{confirmedOrders}</p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-blue-500" />
        </div>

        <div className="p-5 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-[#666666] font-bold uppercase">DELIVERED ORDERS</span>
            <p className="text-xl font-black text-[#25D366] font-mono mt-1">{deliveredOrders}</p>
          </div>
          <Truck className="w-6 h-6 text-[#25D366]" />
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#111111]">
            RECENT ORDERS
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs text-[#666666] hover:text-[#111111] font-bold flex items-center gap-1 uppercase"
          >
            <span>VIEW ALL ORDERS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#888888]">Loading recent orders...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center text-[#888888]">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#666666]">
              <thead>
                <tr className="border-b border-[#EAEAEA] text-[#888888] font-bold uppercase">
                  <th className="py-3 px-2">ORDER ID</th>
                  <th className="py-3 px-2">CUSTOMER</th>
                  <th className="py-3 px-2">ITEMS</th>
                  <th className="py-3 px-2">AMOUNT</th>
                  <th className="py-3 px-2">STATUS</th>
                  <th className="py-3 px-2">DATE</th>
                  <th className="py-3 px-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#F8F8F8]">
                    <td className="py-3 px-2 font-mono font-bold text-[#111111]">{ord.orderId}</td>
                    <td className="py-3 px-2 font-semibold text-[#111111]">
                      {ord.customerName}
                      <span className="block text-[11px] text-[#888888] font-normal">{ord.phone}</span>
                    </td>
                    <td className="py-3 px-2">{ord.items.length} items</td>
                    <td className="py-3 px-2 font-mono font-bold text-[#111111]">
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${getStatusBadge(
                          ord.orderStatus
                        )}`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-[#888888] font-mono">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Link
                        href={`/admin/orders/${ord._id}`}
                        className="text-xs font-bold text-[#111111] bg-white border border-[#EAEAEA] px-3 py-1.5 rounded-lg hover:bg-[#F8F8F8] transition-colors"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
