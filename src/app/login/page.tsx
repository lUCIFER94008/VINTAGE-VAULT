'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      showToast('Login successful! Welcome back to VINTAGE VAULT.', 'success');
      router.push('/account');
    } else {
      showToast(res.message || 'Login failed. Please check your credentials.', 'error');
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#888888] uppercase">
            WELCOME BACK
          </span>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
            CUSTOMER LOGIN
          </h1>
          <p className="text-xs text-[#666666]">
            Sign in to access your orders, wishlist, and saved addresses.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
              EMAIL / PHONE
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="e.g. rizwan@example.com or 9876543210"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-[#111111]"
                required
              />
              <Mail className="w-4 h-4 text-[#888888] absolute left-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
              PASSWORD
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
            <span>{loading ? 'LOGGING IN...' : 'LOGIN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-4 border-t border-[#EAEAEA] text-center text-xs text-[#666666]">
            <Link href="/register" className="hover:text-[#111111] font-semibold underline">
              Create an Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
