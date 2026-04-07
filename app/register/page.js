'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, ChevronRight, Loader2, ShieldCheck, UserCircle, Key } from 'lucide-react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    adminSecret: ''
  });

  const validate = () => {
    if (formData.phone.length !== 10) {
      alert("Phone must be 10 digits");
      return false;
    }
    if (!formData.email.includes("@")) {
      alert("Email format invalid");
      return false;
    }
    if (formData.role === 'admin' && !formData.adminSecret) {
      alert("Admin Secret Key is required for Admin registration");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.error) {
        alert("❌ " + data.error);
      } else {
        alert("✅ Registered successfully! Please login.");
        window.location.href = "/login";
      }
    } catch (error) {
      alert("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-black overflow-hidden relative">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-900/5 blur-[120px] rounded-full animate-pulse-slow" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#0a0a0a] rounded-3xl border border-white/5 p-10 md:p-12 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <AnimatePresence mode="wait">
            {formData.role === 'admin' ? (
              <motion.div
                key="admin-badge"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="inline-flex items-center space-x-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1 mb-4"
              >
                <ShieldCheck size={12} className="text-gold" />
                <span className="text-[10px] text-gold font-black uppercase tracking-widest">Admin Access Vault</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <h1 className="text-3xl font-black tracking-tighter mb-2 uppercase italic text-white underline decoration-gold/50 decoration-4">CREATE <span className="text-gold">ACCOUNT</span></h1>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">Join the VINTAGE.VAULT exclusive</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="bg-black/50 border border-white/5 rounded-2xl p-1 mb-6 flex">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'user' })}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                formData.role === 'user' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'
              }`}
            >
              <UserCircle size={14} />
              <span>Standard User</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'admin' })}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                formData.role === 'admin' ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-gray-500 hover:text-gold'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Vault Admin</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {formData.role === 'admin' && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-2 ml-1">Admin Secret Key</label>
                <div className="relative">
                  <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60" />
                  <input 
                    type="password" 
                    value={formData.adminSecret}
                    onChange={(e) => setFormData({...formData, adminSecret: e.target.value})}
                    required={formData.role === 'admin'}
                    placeholder="Enter Vault Access Code"
                    className="w-full bg-gold/5 border border-gold/30 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-gold outline-none transition text-gold placeholder:text-gold/20"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 ml-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="R7 Designer"
                className="w-full bg-black border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-gold outline-none transition text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 ml-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="name@example.com"
                className="w-full bg-black border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-gold outline-none transition text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 ml-1">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
                placeholder="9605333248"
                className="w-full bg-black border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-gold outline-none transition text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 ml-1">Choose Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                placeholder="••••••••"
                className="w-full bg-black border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-gold outline-none transition text-white"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center space-x-3 text-sm hover:bg-gold disabled:opacity-50 transition-all font-sans shadow-xl mt-6"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <><span>Create Vault Access</span> <ChevronRight size={18} /></>}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-gray-500 mb-4 tracking-tight font-light">Already a member of our exclusive vault?</p>
            <Link href="/login">
              <button className="text-gold text-[10px] uppercase tracking-[0.2em] font-black border border-gold/30 px-6 py-2 rounded-full hover:bg-gold hover:text-black transition-all">
                Sign In
              </button>
            </Link>
        </div>
      </motion.div>
    </div>
  );
}
