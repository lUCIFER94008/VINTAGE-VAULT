'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronLeft, ShieldCheck, Truck, RefreshCw, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('L');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          const found = data.data.find(p => p._id === id);
          setProduct(found);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
        <p className="text-gray-400 uppercase tracking-widest text-xs">Accessing our collection...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-center p-6">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-400 mb-8">The item you are looking for has been removed or is no longer available.</p>
        <Link href="/products">
          <button className="bg-gold text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs">
            Return to Shop
          </button>
        </Link>
      </div>
    );
  }

  const whatsappNumber = "919605333248";
  const message = `Halo VINTAGE.VAULT, I want to order:
🛍️ Product: ${product.name}
💰 Price: ₹${product.price}
📏 Size: ${selectedSize}
🔗 Link: ${window.location.href}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <Link href="/products" className="inline-flex items-center text-gray-400 hover:text-gold transition mb-8 uppercase tracking-widest text-[10px] font-bold">
        <ChevronLeft size={16} className="mr-1" /> Back to Collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[#111] border border-white/5 shadow-2xl"
        >
          <img 
            src={product.image} 
            alt={product.name}
            className={`w-full h-full object-cover ${product.available === false ? 'grayscale-[0.5] opacity-60' : ''}`}
          />
          <div className={`absolute top-6 left-6 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold border tracking-widest uppercase ${
            product.available !== false ? 'bg-black/60 text-gold border-gold/20' : 'bg-red-500/20 text-red-500 border-red-500/30'
          }`}>
            {product.available !== false ? 'Surplus Curated' : 'Out of Stock'}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase">{product.name}</h1>
            <p className="text-3xl font-bold text-gold italic tracking-tight">₹{product.price}</p>
          </div>

          <div className="mb-8 p-6 bg-[#0a0a0a] rounded-2xl border border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">Description</h3>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              {product.description || "This premium surplus item has been carefully selected for our vault. Sustainable fashion meets timeless style."}
            </p>
          </div>

          {/* Size Selection */}
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Select Size</h3>
            <div className="flex gap-4">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={product.available === false}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border transition-all duration-300 font-bold ${
                    selectedSize === size 
                      ? 'border-gold bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                      : 'border-white/10 text-gray-500 hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-4 mb-12">
            {product.available !== false ? (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#25D366] text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center space-x-3 text-sm hover:brightness-110 transition-all font-sans shadow-xl"
                >
                  <span>Order via WhatsApp</span>
                  <ShoppingBag size={20} />
                </motion.button>
              </a>
            ) : (
              <button 
                disabled
                className="w-full bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center space-x-3 text-sm cursor-not-allowed"
              >
                <span>Currently Unavailable</span>
              </button>
            )}
            <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest font-semibold flex items-center justify-center space-x-2">
              <span className="w-1 h-1 bg-gold rounded-full mr-2" />
              <span>Available for COD All India Shipping</span>
              <span className="w-1 h-1 bg-gold rounded-full ml-2" />
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
              <div className="flex items-start space-x-3">
                 <Truck className="text-gold mt-1" size={18} />
                 <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">All India Shipping</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Delivery in 3-7 days.</p>
                 </div>
              </div>
              <div className="flex items-start space-x-3">
                 <RefreshCw className="text-gold mt-1" size={18} />
                 <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Easy Exchange</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Replacement available.</p>
                 </div>
              </div>
              <div className="flex items-start space-x-3">
                 <ShieldCheck className="text-gold mt-1" size={18} />
                 <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Secure COD</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Pay on delivery.</p>
                 </div>
              </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
