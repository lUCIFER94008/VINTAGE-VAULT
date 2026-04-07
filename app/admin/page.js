'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, CheckCircle, Loader2, IndianRupee, Image as ImageIcon, LogOut, User as UserIcon, Edit, Trash2, Check, Package, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '5 Sleeve Jersey',
    file: null
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
      fetchRecentProducts();
    }
  }, []);

  const fetchRecentProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching recent products:', error);
    }
  };

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

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      file: null // Will keep existing image unless new one selected
    });
    setPreview(product.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this unique piece from the vault?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setToast({ message: 'Product Deleted!', type: 'success' });
        fetchRecentProducts();
      }
    } catch (error) {
      setToast({ message: 'Error deleting product', type: 'error' });
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !currentStatus }),
      });
      const result = await res.json();
      if (result.success) {
        setToast({ message: `Status: ${!currentStatus ? 'Available' : 'Out of Stock'}`, type: 'success' });
        fetchRecentProducts();
      }
    } catch (error) {
      setToast({ message: 'Error updating availability', type: 'error' });
    } finally {
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Handle Edit (Update)
        const res = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            price: formData.price,
            description: formData.description,
            category: formData.category,
            // image update via normal UI logic would be more complex, 
            // but the user's snippet doesn't show image editing for the Put.
            // I'll keep the current image if no file selected.
          }),
        });

        const result = await res.json();
        if (result.success) {
          setToast({ message: 'Item Updated!', type: 'success' });
          setEditingId(null);
          setFormData({ name: '', price: '', description: '', category: '5 Sleeve Jersey', file: null });
          setPreview(null);
          fetchRecentProducts();
        }
      } else {
        // Handle Create
        if (!formData.file) {
           alert('Please select an image');
           setLoading(false);
           return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('file', formData.file);

        const res = await fetch('/api/products', {
          method: 'POST',
          body: data,
        });

        const result = await res.json();
        if (result.success) {
          setToast({ message: 'Product Added Successfully!', type: 'success' });
          setFormData({ name: '', price: '', description: '', category: '5 Sleeve Jersey', file: null });
          setPreview(null);
          fetchRecentProducts();
        } else {
          setToast({ message: result.error || 'Failed to add product', type: 'error' });
        }
      }
    } catch (error) {
      setToast({ message: 'Error in vault operation', type: 'error' });
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
                  <span>SYNCHRONIZING VAULT...</span>
                </>
              ) : (
                <>
                  {editingId ? <RefreshCw size={20} /> : <Upload size={20} />}
                  <span>{editingId ? 'UPDATE UNIQUE PIECE' : 'ADD TO COLLECTION'}</span>
                </>
              )}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(null); setFormData({name:'', price:'', description:'', category:'5 Sleeve Jersey', file:null}); setPreview(null); }}
                className="w-full mt-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold hover:text-white transition"
              >
                Cancel Editing
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Recent Products Section */}
      <div className="mt-24">
        <div className="flex items-center space-x-4 mb-12">
          <div className="bg-gold p-2 rounded-lg">
            <Package size={20} className="text-black" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter uppercase italic">Vault Inventory</h2>
          <div className="h-[1px] flex-1 bg-white/5 ml-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {products.map((product) => (
              <motion.div 
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden group hover:border-gold/30 transition-all shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                  <div className={`absolute top-4 right-4 ${product.available !== false ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-500'} backdrop-blur-md px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest`}>
                    {product.available !== false ? 'Available' : 'Out of Stock'}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-lg font-bold text-white tracking-tight line-clamp-1">{product.name}</h4>
                    <span className="text-gold font-bold">₹{product.price}</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-6">{product.category}</p>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-white/5 hover:bg-gold hover:text-black py-3 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest border border-white/5"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleToggleAvailability(product._id, product.available !== false)}
                      className={`flex-1 flex items-center justify-center space-x-2 ${product.available !== false ? 'bg-green-500/5 border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white'} py-3 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest border`}
                    >
                      {product.available !== false ? <Check size={14} /> : <AlertTriangle size={14} />}
                      <span>{product.available !== false ? 'Set OOS' : 'Set Available'}</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="w-12 h-12 flex items-center justify-center bg-red-500/5 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <Package size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold font-sans">The vault inventory is currently empty.</p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed bottom-10 right-10 z-[100] flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl border ${
              toast.type === 'success' ? 'bg-black border-gold/50 text-gold shadow-gold/20' : 'bg-red-950 border-red-500/50 text-red-100 shadow-red-500/20'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span className="text-xs font-bold uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
