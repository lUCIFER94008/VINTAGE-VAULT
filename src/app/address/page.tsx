'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Address } from '@/types';

export default function AddressPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items } = useCart();
  const { showToast } = useToast();

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedSavedIndex, setSelectedSavedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses[0];
      setFormData(defaultAddr);
      setSelectedSavedIndex(0);
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    }
    if (!formData.house.trim()) newErrors.house = 'House / Building No. is required';
    if (!formData.street.trim()) newErrors.street = 'Street / Road name is required';
    if (!formData.area.trim()) newErrors.area = 'Area / Locality is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6-digit Indian Pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectSavedAddress = (idx: number, addr: Address) => {
    setSelectedSavedIndex(idx);
    setFormData(addr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in your delivery address.', 'error');
      return;
    }

    // Save temporary address data to localStorage for order summary
    localStorage.setItem('vv_checkout_address', JSON.stringify(formData));
    router.push('/order-summary');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Checkout Steps Progress */}
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#888888] border-b border-[#EAEAEA] pb-4">
          <span className="text-[#888888]">1. Cart</span>
          <span className="text-[#111111] border-b-2 border-[#111111] pb-4 -mb-4 font-extrabold flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#111111]" /> 2. Address
          </span>
          <span className="text-[#888888]">3. Summary & WhatsApp</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
            DELIVERY ADDRESS
          </h1>
          <p className="text-xs text-[#666666]">
            Enter your complete Indian shipping address where order updates will be sent.
          </p>
        </div>

        {/* Saved Addresses Selector (For Logged-in Users) */}
        {user && user.addresses && user.addresses.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#888888] block">
              SAVED ADDRESSES:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.addresses.map((addr, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSavedAddress(idx, addr)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedSavedIndex === idx
                      ? 'bg-[#F8F8F8] border-[#111111] shadow-md'
                      : 'bg-white border-[#EAEAEA] hover:border-zinc-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-[#111111] text-sm">{addr.fullName}</h4>
                    {selectedSavedIndex === idx && (
                      <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                    )}
                  </div>
                  <p className="text-xs text-[#666666] mt-1">{addr.phone}</p>
                  <p className="text-xs text-[#111111] mt-2 line-clamp-2">
                    {addr.house}, {addr.street}, {addr.area}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Address Input Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                FULL NAME *
              </label>
              <input
                type="text"
                placeholder="e.g. Mohammed Rizwan"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full bg-white border ${
                  errors.fullName ? 'border-[#DC2626]' : 'border-[#EAEAEA]'
                } text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111]`}
              />
              {errors.fullName && <p className="text-xs text-[#DC2626]">{errors.fullName}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                PHONE NUMBER * (FOR WHATSAPP)
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full bg-white border ${
                  errors.phone ? 'border-[#DC2626]' : 'border-[#EAEAEA]'
                } text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111]`}
              />
              {errors.phone && <p className="text-xs text-[#DC2626]">{errors.phone}</p>}
            </div>

            {/* House / Building */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                HOUSE / BUILDING NO. *
              </label>
              <input
                type="text"
                placeholder="e.g. Flat 4B, Vault Apartments"
                value={formData.house}
                onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                className={`w-full bg-white border ${
                  errors.house ? 'border-[#DC2626]' : 'border-[#EAEAEA]'
                } text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111]`}
              />
              {errors.house && <p className="text-xs text-[#DC2626]">{errors.house}</p>}
            </div>

            {/* Street / Road */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                STREET / ROAD NAME *
              </label>
              <input
                type="text"
                placeholder="e.g. Main Street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className={`w-full bg-white border ${
                  errors.street ? 'border-[#DC2626]' : 'border-[#EAEAEA]'
                } text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111]`}
              />
              {errors.street && <p className="text-xs text-[#DC2626]">{errors.street}</p>}
            </div>

            {/* Area / Locality */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                AREA / LOCALITY *
              </label>
              <input
                type="text"
                placeholder="e.g. Marine Drive"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className={`w-full bg-white border ${
                  errors.area ? 'border-[#DC2626]' : 'border-[#EAEAEA]'
                } text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111]`}
              />
              {errors.area && <p className="text-xs text-[#DC2626]">{errors.area}</p>}
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                CITY *
              </label>
              <input
                type="text"
                placeholder="e.g. Kochi"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={`w-full bg-white border ${
                  errors.city ? 'border-[#DC2626]' : 'border-[#EAEAEA]'
                } text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111]`}
              />
              {errors.city && <p className="text-xs text-[#DC2626]">{errors.city}</p>}
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                STATE *
              </label>
              <input
                type="text"
                placeholder="e.g. Kerala"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className={`w-full bg-white border ${
                  errors.state ? 'border-[#DC2626]' : 'border-[#EAEAEA]'
                } text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111]`}
              />
              {errors.state && <p className="text-xs text-[#DC2626]">{errors.state}</p>}
            </div>

            {/* Pincode */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                PINCODE * (6 DIGITS)
              </label>
              <input
                type="text"
                placeholder="e.g. 682001"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className={`w-full bg-white border ${
                  errors.pincode ? 'border-[#DC2626]' : 'border-[#EAEAEA]'
                } text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111] font-mono`}
              />
              {errors.pincode && <p className="text-xs text-[#DC2626]">{errors.pincode}</p>}
            </div>

            {/* Landmark */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                LANDMARK (OPTIONAL)
              </label>
              <input
                type="text"
                placeholder="e.g. Near Metro Station / Clock Tower"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#111111] hover:bg-zinc-800 text-white font-black text-xs py-4 rounded-2xl uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>REVIEW ORDER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
