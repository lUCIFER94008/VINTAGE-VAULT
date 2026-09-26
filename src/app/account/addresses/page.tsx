'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Address } from '@/types';

export default function AccountAddressesPage() {
  const { user, updateUserAddresses } = useAuth();
  const { showToast } = useToast();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Address>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    house: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });

  const addresses = user?.addresses || [];

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.house || !formData.city || !formData.pincode) {
      showToast('Please fill in required fields.', 'error');
      return;
    }

    const updated = [...addresses, formData];
    updateUserAddresses(updated);
    showToast('New address saved to profile.', 'success');
    setShowAddForm(false);
    setFormData({
      fullName: user?.name || '',
      phone: user?.phone || '',
      house: '',
      street: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
    });
  };

  const handleDeleteAddress = (idx: number) => {
    const updated = addresses.filter((_, i) => i !== idx);
    updateUserAddresses(updated);
    showToast('Address removed.', 'info');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="border-b border-[#EAEAEA] pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
              MY SAVED ADDRESSES
            </h1>
            <p className="text-xs text-[#666666] mt-1">
              Manage shipping addresses for effortless 1-click checkout.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#111111] text-white font-bold text-xs px-4 py-2.5 rounded-xl uppercase flex items-center gap-1.5 hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> ADD NEW ADDRESS
          </button>
        </div>

        {/* Add New Address Form */}
        {showAddForm && (
          <form onSubmit={handleAddAddress} className="p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase">ADD NEW ADDRESS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="bg-white border border-[#EAEAEA] text-[#111111] rounded-xl p-3 focus:outline-none focus:border-[#111111]"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-white border border-[#EAEAEA] text-[#111111] rounded-xl p-3 focus:outline-none focus:border-[#111111]"
                required
              />
              <input
                type="text"
                placeholder="House / Building No. *"
                value={formData.house}
                onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                className="bg-white border border-[#EAEAEA] text-[#111111] rounded-xl p-3 focus:outline-none focus:border-[#111111]"
                required
              />
              <input
                type="text"
                placeholder="Street / Road *"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="bg-white border border-[#EAEAEA] text-[#111111] rounded-xl p-3 focus:outline-none focus:border-[#111111]"
                required
              />
              <input
                type="text"
                placeholder="Area / Locality *"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="bg-white border border-[#EAEAEA] text-[#111111] rounded-xl p-3 focus:outline-none focus:border-[#111111]"
                required
              />
              <input
                type="text"
                placeholder="City *"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="bg-white border border-[#EAEAEA] text-[#111111] rounded-xl p-3 focus:outline-none focus:border-[#111111]"
                required
              />
              <input
                type="text"
                placeholder="State *"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="bg-white border border-[#EAEAEA] text-[#111111] rounded-xl p-3 focus:outline-none focus:border-[#111111]"
                required
              />
              <input
                type="text"
                placeholder="Pincode (6 digits) *"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="bg-white border border-[#EAEAEA] text-[#111111] rounded-xl p-3 focus:outline-none font-mono focus:border-[#111111]"
                required
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-[#F8F8F8] border border-[#EAEAEA] text-[#666666] text-xs font-bold"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold uppercase shadow-sm"
              >
                SAVE ADDRESS
              </button>
            </div>
          </form>
        )}

        {/* Address Cards List */}
        {addresses.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-[#F8F8F8] border border-[#EAEAEA] text-[#666666]">
            No saved addresses. Click &quot;ADD NEW ADDRESS&quot; to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {addresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-[#EAEAEA] space-y-3 relative group shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#111111] text-base">{addr.fullName}</h3>
                    <p className="text-xs text-[#666666] font-mono mt-0.5">{addr.phone}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(idx)}
                    className="p-2 text-[#888888] hover:text-[#DC2626] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#111111] pt-2 border-t border-[#EAEAEA]">
                  {addr.house}, {addr.street}, {addr.area}
                </p>
                <p className="text-xs text-[#666666]">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                {addr.landmark && (
                  <p className="text-[11px] text-[#888888]">Landmark: {addr.landmark}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
