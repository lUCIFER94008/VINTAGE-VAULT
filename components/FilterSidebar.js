export default function FilterSidebar() {
  return (
    <div className="bg-black/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-8 sticky top-32">
      <div>
        <h2 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-6 italic">Collections</h2>
        <ul className="space-y-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
          {["5 Sleeve Jersey", "Shorts", "Track Pant", "Printed Socks", "Headwear", "Baggy"].map((item) => (
            <li key={item} className="hover:text-gold cursor-pointer transition-colors flex items-center">
              <span className="w-1 h-1 bg-white/20 rounded-full mr-2" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-6 italic">Price Range</h2>
        <ul className="space-y-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
          {["Under ₹500", "₹500 - ₹1000", "₹1000 - ₹2000", "Above ₹2000"].map((range) => (
            <li key={range} className="hover:text-gold cursor-pointer transition-colors flex items-center">
               <div className="w-3 h-3 border border-white/10 rounded mr-3" />
              {range}
            </li>
          ))}
        </ul>
      </div>
      
      <button className="w-full py-4 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-white hover:bg-white/5 transition-all">
        Clear All Filters
      </button>
    </div>
  );
}
