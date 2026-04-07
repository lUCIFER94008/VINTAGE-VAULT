'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, CheckCircle, Loader2, IndianRupee, Image as ImageIcon, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '5 Sleeve Jersey',
    file: null // Added file field
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      window.location.href = "/login";
    } else {
      setAdminUser(user);
      setCheckingAuth(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = "/";
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData({ ...formData, file: selectedFile });
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) return alert('Please select an image');

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('file', formData.file); // Field named 'file'

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (result.success) {
        setToast({ message: 'Product Added Successfully!', type: 'success' });
        // Reset form
        setFormData({ name: '', price: '', description: '', category: '5 Sleeve Jersey', file: null });
        setPreview(null);
      } else {
        setToast({ message: result.error || 'Failed to add product', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Error adding product', type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
        <p className="text-gray-400 uppercase tracking-widest text-xs font-bold">Verifying Vault Authorization...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">ADMIN DASHBOARD</h1>
          <div className="flex items-center text-gold space-x-2">
            <UserIcon size={14} />
            <p className="uppercase tracking-widest text-[10px] font-bold">Welcome, {adminUser?.email.split('@')[0]}</p>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-500/10 border border-red-500/50 text-red-100 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg"
        >
          <LogOut size={14} />
          <span>Secure Logout</span>
        </motion.button>
      </div>

      <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full -mr-20 -mt-20" />
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          
          {/* Left Column: Image Upload */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-4">Product Visuals</h3>
            
            <div className="relative aspect-[3/4] w-full bg-[#111] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden group hover:border-gold/30 transition-all cursor-pointer">
              {preview ? (
                <>
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-4 right-4 bg-black/80 p-2 rounded-full text-white hover:text-red-500 transition"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <>
                  <ImageIcon size={48} className="text-gray-600 mb-4 group-hover:text-gold transition" />
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Upload Image</p>
                  <p className="text-[10px] text-gray-700 mt-2 uppercase">PNG, JPG up to 10MB</p>
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                </>
              )}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-4">Product Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Product Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="e.g. vintage oversized tee"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Price (₹)</label>
                  <div className="relative">
                    <IndianRupee size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                      placeholder="999"
                      className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-gold outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none transition appearance-none"
                  >
                    <option>5 Sleeve Jersey</option>
                    <option>Shorts</option>
                    <option>Track Pant</option>
                    <option>Printed Socks</option>
                    <option>Headwear</option>
                    <option>Baggy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Description</label>
                <textarea 
                  rows="4" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  placeholder="Tell us about this unique piece..."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none transition resize-none"
                ></textarea>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black font-black uppercase tracking-[0.2em] py-4 rounded-2xl flex items-center justify-center space-x-3 text-sm hover:brightness-110 disabled:opacity-50 transition-all font-sans shadow-[0_0_20px_rgba(212,175,55,0.2)] mt-8"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>UPLOADING TO VAULT...</span>
                </>
              ) : (
                <>
                  <Upload size={20} />
                  <span>ADD TO COLLECTION</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed bottom-10 right-10 z-[100] flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl border ${
              toast.type === 'success' ? 'bg-black border-gold/50 text-gold' : 'bg-red-950 border-red-500/50 text-red-100'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={20} />}
            <span className="text-xs font-bold uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
