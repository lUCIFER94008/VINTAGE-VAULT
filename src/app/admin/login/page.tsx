'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState<{ title: string; subtitle: string } | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorState(null);

    if (!email.trim()) {
      const err = { title: 'ADMIN EMAIL IS REQUIRED', subtitle: 'Please enter your administrator email address.' };
      setErrorState(err);
      showToast('ADMIN EMAIL IS REQUIRED', 'error');
      return;
    }

    if (!password.trim()) {
      const err = { title: 'ADMIN PASSWORD IS REQUIRED', subtitle: 'Please enter your administrator password.' };
      setErrorState(err);
      showToast('ADMIN PASSWORD IS REQUIRED', 'error');
      return;
    }

    setLoading(true);
    const res = await adminLogin(email.trim(), password);
    setLoading(false);

    if (res.success) {
      showToast('Authenticated as Admin!', 'success');
      router.push('/admin/dashboard');
    } else {
      if (res.status === 500 || (res.message && res.message.toLowerCase().includes('not configured'))) {
        const err = {
          title: 'ADMIN AUTHENTICATION NOT CONFIGURED',
          subtitle: 'Please configure the required server environment variables.',
        };
        setErrorState(err);
        showToast('Admin authentication is not configured.', 'error');
      } else {
        const err = {
          title: 'INVALID ADMIN CREDENTIALS',
          subtitle: 'Incorrect administrator email or password.',
        };
        setErrorState(err);
        showToast('Invalid admin credentials.', 'error');
      }
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
          {errorState && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-red-900">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorState.title}</span>
              </div>
              <p className="text-[#555555] font-medium leading-relaxed pl-5">
                {errorState.subtitle}
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
              ADMIN EMAIL
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="admin@vintagevault.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorState) setErrorState(null);
                }}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-[#111111] font-mono"
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorState) setErrorState(null);
                }}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-sm rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-[#111111]"
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
