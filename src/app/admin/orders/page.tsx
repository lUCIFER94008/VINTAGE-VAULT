'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order, OrderStatus } from '@/types';
import { formatCurrency } from '@/lib/whatsapp';
import { useToast } from '@/context/ToastContext';
import { Search, Eye, MessageCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/api/orders';
      if (statusFilter !== 'All') url += `?status=${statusFilter}`;
      if (search.trim()) url += `${statusFilter !== 'All' ? '&' : '?'}search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order status updated to ${newStatus}`, 'success');
        fetchOrders();
      } else {
        showToast(data.message || 'Failed to update order status.', 'error');
      }
    } catch (err) {
      showToast('Error updating status.', 'error');
    }
  };

  const getStatusBadgeClass = (status: string) => {
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

  const statusOptions: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="bg-white space-y-8 min-h-screen">
      {/* Header */}
      <div className="border-b border-[#EAEAEA] pb-6">
        <span className="text-xs font-bold tracking-widest text-[#25D366] uppercase">
          CUSTOMER ORDERS
        </span>
        <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
          ORDER MANAGEMENT
        </h1>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex border-b border-[#EAEAEA] overflow-x-auto gap-2 pb-2">
          {['All', ...statusOptions].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#111111] text-white'
                  : 'bg-white border border-[#EAEAEA] text-[#666666] hover:text-[#111111]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search Order ID, Customer, Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-xs rounded-xl px-4 py-2.5 pl-9 focus:outline-none focus:border-[#111111]"
          />
          <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-3" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-4">
        {loading ? (
          <div className="p-12 text-center text-[#888888]">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-[#888888]">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#666666]">
              <thead>
                <tr className="border-b border-[#EAEAEA] text-[#888888] font-bold uppercase">
                  <th className="py-3 px-2">ORDER ID</th>
                  <th className="py-3 px-2">CUSTOMER</th>
                  <th className="py-3 px-2">PHONE</th>
                  <th className="py-3 px-2">AMOUNT</th>
                  <th className="py-3 px-2">STATUS</th>
                  <th className="py-3 px-2">CHANGE STATUS</th>
                  <th className="py-3 px-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#F8F8F8]">
                    <td className="py-3 px-2 font-mono font-bold text-[#111111]">{ord.orderId}</td>
                    <td className="py-3 px-2 font-semibold text-[#111111]">{ord.customerName}</td>
                    <td className="py-3 px-2 font-mono text-[#666666]">{ord.phone}</td>
                    <td className="py-3 px-2 font-mono font-bold text-[#111111]">
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${getStatusBadgeClass(
                          ord.orderStatus
                        )}`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusUpdate(ord._id, e.target.value as OrderStatus)}
                        className="bg-white border border-[#EAEAEA] text-[#111111] text-[11px] font-semibold rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-lg border border-[#25D366]/30 transition-colors"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        </a>
                        <Link
                          href={`/admin/orders/${ord._id}`}
                          className="p-1.5 bg-white hover:bg-[#F8F8F8] text-[#111111] rounded-lg border border-[#EAEAEA] transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </div>
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
