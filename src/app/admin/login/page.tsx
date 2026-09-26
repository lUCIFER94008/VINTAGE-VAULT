'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter admin credentials.', 'error');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      showToast('Authenticated as Admin!', 'success');
      router.push('/admin/dashboard');
    } else {
      showToast(res.message || 'Admin authentication failed.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#F8F8F8] border border-[#EAEAEA] text-[#111111] flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#111111] uppercase block">
            AUTHENTICATED AREA
          </span>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
            VINTAGE VAULT ADMIN
          </h1>
          <p className="text-xs text-[#666666]">
            Enter administrative credentials to access store analytics and order management.
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="p-8 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
              ADMIN EMAIL
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="admin@vintagevault.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-[#111111] font-mono"
                required
              />
              <Mail className="w-4 h-4 text-[#888888] absolute left-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
              ADMIN PASSWORD
            </label>
            <div className="relative flex items-center">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-[#111111]"
                required
              />
              <Lock className="w-4 h-4 text-[#888888] absolute left-4" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] hover:bg-zinc-800 text-white font-black text-xs py-4 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN TO DASHBOARD'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
