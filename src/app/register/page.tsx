'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ArrowRight, User, Mail, Phone, Lock } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      showToast('All fields are required.', 'error');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      showToast('Please enter a valid 10-digit Indian phone number.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setLoading(true);
    const res = await register(name, email, phone, password);
    setLoading(false);

    if (res.success) {
      showToast('Account created successfully! Welcome to VINTAGE VAULT.', 'success');
      router.push('/account');
    } else {
      showToast(res.message || 'Registration failed.', 'error');
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#888888] uppercase">
            JOIN THE VAULT
          </span>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
            CREATE AN ACCOUNT
          </h1>
          <p className="text-xs text-[#666666]">
            Sign up to track orders, save wishlists, and receive drop alerts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
              FULL NAME
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="e.g. Mohammed Rizwan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-[#111111]"
                required
              />
              <User className="w-4 h-4 text-[#888888] absolute left-4" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
              EMAIL ADDRESS
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="rizwan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-[#111111]"
                required
              />
              <Mail className="w-4 h-4 text-[#888888] absolute left-4" />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
              INDIAN PHONE NUMBER
            </label>
            <div className="relative flex items-center">
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-[#111111]"
                required
              />
              <Phone className="w-4 h-4 text-[#888888] absolute left-4" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
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

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
              CONFIRM PASSWORD
            </label>
            <div className="relative flex items-center">
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-[#111111]"
                required
              />
              <Lock className="w-4 h-4 text-[#888888] absolute left-4" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] hover:bg-zinc-800 text-white font-black text-xs py-4 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 pt-3"
          >
            <span>{loading ? 'CREATING ACCOUNT...' : 'REGISTER'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-3 border-t border-[#EAEAEA] text-center text-xs text-[#666666]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#111111] font-bold underline">
              Login Here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
