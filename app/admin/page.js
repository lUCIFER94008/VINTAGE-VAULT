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
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState(""); // "available" or "oos"
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '5 Sleeve Jersey',
    files: [], // Array of File objects for NEW uploads
    sizes: [] // Array of active size strings (e.g. ["S", "M"])
  });
  const [previews, setPreviews] = useState([]); // Array of strings (Cloudinary URLs or local blobs)
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
      const res = await fetch('/api/products?admin=true');
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
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      // Validate max 5 images total (new + existing)
      if (previews.length + selectedFiles.length > 5) {
        alert("Maximum 5 images allowed per product.");
        return;
      }

      setFormData({ ...formData, files: [...formData.files, ...selectedFiles] });
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const removedPreview = previews[index];
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);

    if (removedPreview.startsWith('blob:')) {
      const blobIndex = previews.slice(0, index).filter(p => p.startsWith('blob:')).length;
      const newFiles = [...formData.files];
      newFiles.splice(blobIndex, 1);
      setFormData({ ...formData, files: newFiles });
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      files: [] // No new files yet
    });
    setPreviews(product.images || [product.image]); // Handle migration fallback
    
    setFormData(prev => ({ ...prev, sizes: product.sizes || [] }));
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

  const handleActionClick = (product, type) => {
    setSelectedProduct(product);
    setActionType(type);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedProduct) return;
    setLoading(true);

    try {
      const status = actionType === "available";
      const res = await fetch(`/api/products/${selectedProduct._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: status }),
      });
      const result = await res.json();
      if (result.success || res.ok) {
        setToast({ message: `Status: ${status ? 'Available' : 'Out of Stock'}`, type: 'success' });
        fetchRecentProducts();
      }
    } catch (error) {
      setToast({ message: 'Error updating availability', type: 'error' });
    } finally {
      setShowModal(false);
      setLoading(false);
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleSizeChange = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Handle Edit (Update)
        // First upload new files to Cloudinary if any
        let finalImages = previews.filter(p => p.startsWith('http')); // Keep existing Cloudinary URLs
        
        if (formData.files.length > 0) {
          const uploadData = new FormData();
          formData.files.forEach(file => uploadData.append('file', file));
          
          const uploadRes = await fetch('/api/products', {
            method: 'POST',
            body: uploadData,
          });
          const uploadResult = await uploadRes.json();
          if (uploadResult.success) {
            finalImages = [...finalImages, ...uploadResult.data.images];
          } else {
            throw new Error(uploadResult.error || "Failed to upload new images");
          }
        }

        if (finalImages.length === 0) {
          alert('Please provide at least one image');
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            price: formData.price,
            description: formData.description,
            category: formData.category,
            images: finalImages,
            sizes: formData.sizes,
          }),
        });

        const result = await res.json();
        if (result.success) {
          setToast({ message: 'Item Updated!', type: 'success' });
          setEditingId(null);
          setFormData({ name: '', price: '', description: '', category: '5 Sleeve Jersey', files: [], sizes: [] });
          setPreviews([]);
          fetchRecentProducts();
        }
      } else {
        // Handle Create
        if (formData.files.length === 0) {
           alert('Please select at least one image');
           setLoading(false);
           return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('price', formData.price);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('sizes', JSON.stringify(formData.sizes));
        formData.files.forEach(file => data.append('file', file));

        const res = await fetch('/api/products', {
          method: 'POST',
          body: data,
        });

        const result = await res.json();
        if (result.success) {
          setToast({ message: 'Product Added Successfully!', type: 'success' });
          setFormData({ name: '', price: '', description: '', category: '5 Sleeve Jersey', files: [], sizes: [] });
          setPreviews([]);
          fetchRecentProducts();
        } else {
          setToast({ message: result.error || 'Failed to add product', type: 'error' });
        }
      }
    } catch (error) {
      setToast({ message: error.message || 'Error in vault operation', type: 'error' });
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
            
            <div className={`relative min-h-[300px] w-full bg-[#111] rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden p-4 group hover:border-gold/30 transition-all ${previews.length === 0 ? 'cursor-pointer' : ''}`}>
              {previews.length > 0 ? (
                <div className="w-full">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {previews.map((src, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-black border border-white/5">
                        <img src={src} className="w-full h-full object-cover" alt={`Preview ${index}`} />
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black/80 p-1 rounded-full text-white hover:text-red-500 transition shadow-lg"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {previews.length < 5 && (
                      <div className="relative aspect-square rounded-md border border-dashed border-white/20 flex items-center justify-center hover:border-gold/50 cursor-pointer overflow-hidden group">
                        <Upload size={16} className="text-gray-600 group-hover:text-gold transition" />
                        <input 
                          type="file" 
                          multiple
                          onChange={handleFileChange} 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept="image/*"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <ImageIcon size={48} className="text-gray-600 mb-4 group-hover:text-gold transition" />
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Upload Product Images</p>
                  <p className="text-[10px] text-gray-700 mt-2 uppercase">Up to 5 images • PNG, JPG</p>
                  <input 
                    type="file" 
                    multiple
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

              {/* Size Management */}
              <div className="pt-4 border-t border-white/5">
                <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-6">Available Sizes & Stock</label>
                <div className="flex flex-wrap gap-4">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <label key={size} className="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={formData.sizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                        className="w-5 h-5 rounded border-white/10 bg-black text-gold focus:ring-gold focus:ring-offset-black transition"
                      />
                      <span className={`text-sm font-bold uppercase transition-colors ${formData.sizes.includes(size) ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                        {size}
                      </span>
                    </label>
                  ))}
                </div>
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
                onClick={() => { setEditingId(null); setFormData({name:'', price:'', description:'', category:'5 Sleeve Jersey', files:[], sizes:[]}); setPreviews([]); }}
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
                  <img src={product.images?.[0] || product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className={`bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-white`}>
                      {product.images?.length || 1} {product.images?.length === 1 ? 'IMAGE' : 'IMAGES'}
                    </div>
                  </div>
                  <div className={`absolute top-4 right-4 ${product.available !== false ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-500'} backdrop-blur-md px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest`}>
                    {product.available !== false ? 'Available' : 'Out of Stock'}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-lg font-bold text-white tracking-tight line-clamp-1">{product.name}</h4>
                    <span className="text-gold font-bold">₹{product.price}</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">{product.category}</p>
                  
                  {/* Stock Display List */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {product.sizes?.length > 0 ? (
                      product.sizes.map(size => (
                        <span key={size} className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border bg-white/5 border-white/10 text-gray-400">
                          {size}
                        </span>
                      ))
                    ) : (
                      <span className="text-[8px] text-gray-600 uppercase font-bold tracking-widest">Global Size</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-white/5 hover:bg-gold hover:text-black py-3 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest border border-white/5"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleActionClick(product, product.available !== false ? "oos" : "available")}
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

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] px-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 md:p-10 rounded-[2.5rem] w-full max-w-md text-center shadow-3xl"
            >
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 ${actionType === 'available' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {actionType === 'available' ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
              </div>
              
              <h2 className="text-xl md:text-2xl font-black tracking-tight mb-2 uppercase italic text-white leading-tight">
                {actionType === "available"
                  ? "Mark as Available?"
                  : "Mark as Out of Stock?"}
              </h2>

              <p className="text-gray-500 mb-8 uppercase tracking-[0.2em] text-[10px] font-bold">
                {selectedProduct?.name}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 border border-white/5 rounded-2xl text-[10px] uppercase tracking-widest font-black text-gray-500 hover:bg-white/5 transition-all outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all shadow-lg ${
                    actionType === "available"
                      ? "bg-green-500 text-black shadow-green-500/20"
                      : "bg-red-500 text-white shadow-red-500/20"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
