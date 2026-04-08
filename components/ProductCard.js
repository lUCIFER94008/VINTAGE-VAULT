import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product._id}`}>
      <div className="bg-black rounded-3xl overflow-hidden border border-white/10 group hover:border-gold/30 transition-all duration-500 shadow-2xl">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.images?.[0] || product.image || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <p className="text-[9px] font-black uppercase tracking-widest text-gold italic">Vault Piece</p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-white font-black text-lg uppercase tracking-tight group-hover:text-gold transition-colors line-clamp-1">
              {product.name}
            </h2>
          </div>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            {product.category}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-white font-black text-2xl italic tracking-tighter">₹{product.price}</p>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
               <span className="text-xs">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
