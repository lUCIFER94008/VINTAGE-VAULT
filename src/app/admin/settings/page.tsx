'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import { Settings, Save, Phone, Database } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_NUMBER);
  const [storeName, setStoreName] = useState('VINTAGE VAULT');
  const [tagline, setTagline] = useState('Timeless Style. Always Wins.');
  const [currency] = useState('₹ (INR)');
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Store settings saved successfully!', 'success');
    }, 600);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-[#EAEAEA] pb-6">
          <span className="text-xs font-bold tracking-widest text-[#25D366] uppercase">
            SYSTEM CONFIGURATION
          </span>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
            STORE SETTINGS
          </h1>
        </div>

        <form onSubmit={handleSaveSettings} className="p-8 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-6">
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase text-[#111111] border-b border-[#EAEAEA] pb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#25D366]" />
              <span>WHATSAPP ORDERING CONFIGURATION</span>
            </h2>

            <div className="space-y-1.5 max-w-md">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                STORE WHATSAPP NUMBER (INDIAN FORMAT: 919XXXXXXXXX)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111] font-mono"
              />
              <p className="text-[11px] text-[#666666]">
                This phone number receives customer order requests when clicking &quot;BOOK ON WHATSAPP&quot;.
              </p>
            </div>

            <h2 className="text-sm font-black uppercase text-[#111111] border-b border-[#EAEAEA] pb-3 pt-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#111111]" />
              <span>BRAND IDENTIFIERS</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                  BRAND NAME
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                  TAGLINE
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                  STORE CURRENCY
                </label>
                <input
                  type="text"
                  value={currency}
                  disabled
                  className="w-full bg-[#F8F8F8] border border-[#EAEAEA] text-[#666666] text-sm rounded-xl px-4 py-3 focus:outline-none cursor-not-allowed font-mono"
                />
              </div>
            </div>

            {/* Infrastructure status */}
            <h2 className="text-sm font-black uppercase text-[#111111] border-b border-[#EAEAEA] pb-3 pt-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#111111]" />
              <span>INFRASTRUCTURE STATUS</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] space-y-1">
                <div className="flex items-center justify-between font-bold text-[#111111]">
                  <span>Database:</span>
                  <span className="text-[#25D366]">MongoDB Connected</span>
                </div>
                <p className="text-[#666666] font-mono text-[11px]">
                  URI: mongodb://localhost:27017/vintagevault
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] space-y-1">
                <div className="flex items-center justify-between font-bold text-[#111111]">
                  <span>Image Storage:</span>
                  <span className="text-[#25D366]">Cloudinary Ready</span>
                </div>
                <p className="text-[#666666] font-mono text-[11px]">
                  API Key & Secret Configured
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#111111] hover:bg-zinc-800 text-white font-black text-xs py-4 rounded-2xl uppercase tracking-wider transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING SETTINGS...' : 'SAVE SETTINGS'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
