'use client';

import React, { useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/whatsapp';
import { Search } from 'lucide-react';

interface CustomerStat {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder?: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (data.success && Array.isArray(data.customers)) {
          setCustomers(data.customers);
        }
      } catch (err) {
        console.error('Failed to load customer list', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="bg-white space-y-8 min-h-screen">
      {/* Header */}
      <div className="border-b border-[#EAEAEA] pb-6">
        <span className="text-xs font-bold tracking-widest text-[#25D366] uppercase">
          CUSTOMER DIRECTORY
        </span>
        <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
          CUSTOMER MANAGEMENT
        </h1>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter customers by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-xs rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#111111]"
        />
        <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-3" />
      </div>

      {/* Customers Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-4">
        {loading ? (
          <div className="p-12 text-center text-[#888888]">Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-[#888888]">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#666666]">
              <thead>
                <tr className="border-b border-[#EAEAEA] text-[#888888] font-bold uppercase">
                  <th className="py-3 px-2">CUSTOMER NAME</th>
                  <th className="py-3 px-2">EMAIL</th>
                  <th className="py-3 px-2">PHONE</th>
                  <th className="py-3 px-2">TOTAL ORDERS</th>
                  <th className="py-3 px-2">TOTAL SPENT</th>
                  <th className="py-3 px-2">LAST ORDER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-[#F8F8F8]">
                    <td className="py-3.5 px-2 font-bold text-[#111111] flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center font-black text-xs uppercase">
                        {c.name.charAt(0)}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="py-3.5 px-2 font-mono text-[#666666]">{c.email}</td>
                    <td className="py-3.5 px-2 font-mono text-[#111111]">{c.phone}</td>
                    <td className="py-3.5 px-2 font-mono">
                      <span className="bg-[#F8F8F8] border border-[#EAEAEA] px-2.5 py-1 rounded-full text-[#111111] font-bold">
                        {c.totalOrders} orders
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-mono font-bold text-[#111111]">
                      {formatCurrency(c.totalSpent)}
                    </td>
                    <td className="py-3.5 px-2 text-[#888888] font-mono">
                      {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString('en-IN') : 'N/A'}
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
