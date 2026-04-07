'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.error) {
        setError("❌ Invalid login: " + data.error);
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }
    } catch (error) {
      setError("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-black overflow-hidden relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/5 blur-[120px] rounded-full animate-pulse-slow" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#0a0a0a] rounded-3xl border border-white/5 p-10 md:p-12 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter mb-2 uppercase italic text-white">ACCESS THE <span className="text-gold">VAULT</span></h1>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">Sign in to your account</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-100 p-4 rounded-2xl flex items-center mb-6 text-xs"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-black border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-gold outline-none transition text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-black border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-gold outline-none transition text-white"
                />
              </div>
            </div>
          </div>

          <div className="text-right">
            <Link href="#" className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-gold transition font-bold">Forgot Password?</Link>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center space-x-3 text-sm hover:bg-gold disabled:opacity-50 transition-all font-sans shadow-xl mt-4"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <><span>Sign In</span> <ChevronRight size={18} /></>}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-gray-500 mb-4 tracking-tight">New to the vault?</p>
            <Link href="/register">
              <button className="text-gold text-[10px] uppercase tracking-[0.2em] font-black border border-gold/30 px-6 py-2 rounded-full hover:bg-gold hover:text-black transition-all">
                Create Account
              </button>
            </Link>
        </div>
      </motion.div>
    </div>
  );
}
