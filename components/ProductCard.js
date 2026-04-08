import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product._id}`}>
      <div className="bg-[#0a0a0a] rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 border border-white/5 group shadow-2xl">
        {/* 🔥 IMAGE */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* 🔥 DETAILS */}
        <div className="p-5">
          <h2 className="font-bold text-lg text-white group-hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h2>
          <div className="flex justify-between items-center mt-3">
             <p className="text-gold font-black text-xl italic tracking-tighter">₹{product.price}</p>
             <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest border border-white/5 px-2 py-1 rounded">Vault Piece</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
