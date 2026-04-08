'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, IndianRupee, Smartphone, ArrowLeft, ShieldCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          const found = data.data.find(p => p._id === params.id);
          setProduct(found);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
        <p className="text-gray-400 uppercase tracking-widest text-xs">Accessing the Vault...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6">
        <div className="bg-[#111] border border-white/5 p-12 rounded-3xl text-center max-w-md shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">VAULT ERROR</h2>
          <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs leading-relaxed">
            The item you are looking for has either been moved or sold out.
          </p>
          <Link href="/products">
            <button className="bg-gold text-black px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all">
              Return to Catalog
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const handleOrder = (event) => {
    if (!selectedSize) {
      event.preventDefault();
      setError("Please select a size first");
      setTimeout(() => setError(null), 3000);
      return;
    }
  };

  const whatsappMessage = `Hi, I want to order "${product.name}"${selectedSize ? ` (Size: ${selectedSize})` : ''} (Price: ₹${product.price}). Is it available?`;
  const whatsappUrl = `https://wa.me/919605333248?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <Link href="/products" className="inline-flex items-center space-x-2 text-gray-500 hover:text-gold transition-colors mb-12 uppercase tracking-widest text-[10px] font-bold">
        <ArrowLeft size={14} />
        <span>Back to Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex flex-col space-y-4">
          {/* Main Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={selectedImage}
            className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-[#0a0a0a]"
          >
            <img 
              src={(product.images && product.images.length > 0) ? product.images[selectedImage] : product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-gold/20 flex items-center space-x-2">
              <ShieldCheck size={14} className="text-gold" />
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Verified Authenticity</span>
            </div>
          </motion.div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-gold brightness-110' : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <p className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-4">{product.category}</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase italic text-white leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center bg-gold/10 px-6 py-3 rounded-2xl border border-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <IndianRupee size={24} className="text-gold mr-1" />
              <span className="text-3xl font-black text-white tracking-tighter">{product.price}</span>
            </div>
            <span className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">Fixed Price</span>
          </div>

          <div className="border-t border-white/5 pt-8 mb-10">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-4 italic">Curation Notes</h3>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base font-light">
              {product.description}
            </p>
          </div>

          {/* Size Selector */}
          <div className="mb-10">
            <div className="flex justify-between items-end mb-4 italic">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Select Size</h3>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gold opacity-60">Handpicked Dimensions</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {(product.sizes && product.sizes.length > 0) ? (
                product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeSelection(size)}
                      className={`
                        min-w-[56px] h-14 flex items-center justify-center rounded-xl border-2 transition-all duration-300
                        ${isSelected 
                          ? 'bg-gold border-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-105' 
                          : 'border-white/10 text-white hover:border-gold/50 hover:bg-white/5'
                        }
                      `}
                    >
                      <span className="text-sm font-black uppercase tracking-widest">{size}</span>
                    </button>
                  );
                })
              ) : (
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Standard Size</p>
              )}
            </div>
            
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-[10px] mt-4 font-bold uppercase tracking-widest flex items-center"
              >
                <AlertTriangle size={12} className="mr-2" />
                {error}
              </motion.p>
            )}
          </div>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={handleOrder}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-5 rounded-2xl flex items-center justify-center space-x-4 text-sm font-black uppercase tracking-[0.2em] shadow-2xl transition-all ${
                selectedSize 
                  ? 'bg-white text-black hover:bg-gold' 
                  : 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
              }`}
            >
              <Smartphone size={18} />
              <span>Order via WhatsApp</span>
            </motion.button>
          </a>

          <div className="mt-8 flex items-center justify-center space-x-8 text-[9px] text-gray-600 uppercase tracking-widest font-bold">
            <span className="border-b border-gray-600/30 pb-1">All India Shipping</span>
            <span className="border-b border-gray-600/30 pb-1">Exchange Policy</span>
            <span className="border-b border-gray-600/30 pb-1">Cash on Delivery</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
