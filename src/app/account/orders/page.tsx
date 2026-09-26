'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/whatsapp';
import { Eye, ShoppingBag } from 'lucide-react';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const res = await fetch(`/api/orders?search=${user.phone || user.email}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error('Error fetching user orders', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const statusList = ['All', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders =
    activeFilter === 'All'
      ? orders
      : orders.filter((o) => o.orderStatus === activeFilter);

  const getStatusColor = (status: string) => {
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
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-[#F8F8F8] text-[#666666] border-[#EAEAEA]';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#EAEAEA] pb-6">
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">MY ORDERS</h1>
          <p className="text-xs text-[#666666] mt-1">
            Track active orders and review order history.
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex border-b border-[#EAEAEA] overflow-x-auto gap-4 pb-2">
          {statusList.map((st) => (
            <button
              key={st}
              onClick={() => setActiveFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors whitespace-nowrap ${
                activeFilter === st
                  ? 'bg-[#111111] text-white'
                  : 'bg-white border border-[#EAEAEA] text-[#666666] hover:text-[#111111]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="p-12 text-center text-[#666666]">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-[#F8F8F8] border border-[#EAEAEA] space-y-4">
            <ShoppingBag className="w-12 h-12 text-[#888888] mx-auto" />
            <p className="text-[#666666] text-sm">No orders found under &quot;{activeFilter}&quot;.</p>
            <Link
              href="/products"
              className="inline-block bg-[#111111] text-white text-xs font-bold px-6 py-3 rounded-xl uppercase shadow-sm"
            >
              START SHOPPING
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((ord) => (
              <div
                key={ord._id}
                className="p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAEAEA] pb-4 text-xs">
                  <div>
                    <span className="text-[#888888] font-mono">ORDER ID:</span>{' '}
                    <strong className="text-[#111111] font-mono text-sm tracking-wide">
                      {ord.orderId}
                    </strong>
                    <span className="text-[#888888] ml-3">
                      Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full border text-[11px] font-bold uppercase ${getStatusColor(
                        ord.orderStatus
                      )}`}
                    >
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-[#F8F8F8] border border-[#EAEAEA] shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#111111] line-clamp-1">{item.name}</h4>
                        <p className="text-[11px] text-[#666666]">
                          Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#EAEAEA] flex justify-between items-center text-xs">
                  <span className="text-[#666666] font-medium">
                    {ord.items.reduce((s, i) => s + i.quantity, 0)} Total Items
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#888888]">Total:</span>
                    <span className="text-base font-black text-[#111111]">
                      {formatCurrency(ord.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
