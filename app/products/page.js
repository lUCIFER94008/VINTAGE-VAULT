import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  // Step 1: Connect to DB directly (No internal fetch)
  await connectDB();

  // Step 2: Fetch products directly from MongoDB
  const products = await Product.find({ available: true })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="pt-32 pb-24 px-6 max-w-[1400px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* 🔥 SIDEBAR (STICKY ON DESKTOP) */}
        <div className="md:w-64 flex-shrink-0">
          <Suspense fallback={<div className="h-64 bg-[#0a0a0a] animate-pulse rounded-3xl border border-white/10" />}>
            <FilterSidebar />
          </Suspense>
        </div>

        {/* 🔥 MAIN CONTENT AREA */}
        <div className="flex-1">
          {/* HEADER SECTION */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-2">
                THE ENTIRE <span className="text-gold">VAULT</span>
              </h1>
              <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.4em]">
                Surplus / Thrifted Fashion Collection
              </p>
            </div>
            
            <div className="hidden lg:flex items-center space-x-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
              <span>{products.length} Items Found</span>
              <div className="w-1 h-1 bg-gold rounded-full" />
              <span className="text-white">Sorted by Recent</span>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id.toString()}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 bg-[#0a0a0a] rounded-[3rem] border border-white/5 flex flex-col items-center justify-center text-center">
                <div className="bg-white/5 p-4 rounded-full mb-6">
                   <div className="w-12 h-12 border border-white/10 rounded-full animate-pulse" />
                </div>
                <h3 className="text-white font-black uppercase italic tracking-tighter text-3xl mb-2">The Vault is Locked</h3>
                <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto">
                  We are currently refreshing our inventory. message us on whatsapp for exclusive early access.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
