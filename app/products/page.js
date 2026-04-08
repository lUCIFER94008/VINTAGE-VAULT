import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

async function getProducts(category) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    // Ensure the category is encoded for the fetch call
    const url = category 
      ? `${baseUrl}/api/products?category=${encodeURIComponent(category)}`
      : `${baseUrl}/api/products`;
      
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    const result = await res.json();
    return result.data || result;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const categoryFilter = params?.category || "";
  const products = await getProducts(categoryFilter);

  return (
    <div className="pt-32 pb-24 px-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Filter Sidebar - Sticky on desktop */}
        <div className="md:w-64 flex-shrink-0">
          <Suspense fallback={<div className="h-64 bg-[#0a0a0a] animate-pulse rounded-2xl" />}>
            <FilterSidebar />
          </Suspense>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="mb-12">
            <h1 className="text-4xl font-black tracking-tighter mb-4 flex items-center gap-4">
              {categoryFilter ? (
                <>
                  <span className="text-gold">{categoryFilter.toUpperCase()}</span>
                  <span className="text-white">COLLECTION</span>
                </>
              ) : 'THE ENTIRE VAULT'}
            </h1>
            <p className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">
              {categoryFilter ? `Exploring curated ${categoryFilter} fashion` : 'Our complete Surplus / Thrifted Fashion Collection'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-[#0a0a0a] rounded-3xl border border-white/5">
                <p className="text-gray-500 mb-4 tracking-widest uppercase text-sm font-bold">The vault is currently empty.</p>
                <p className="text-gray-600 text-xs text-balance">We're constantly restocking. Check back soon for fresh drops.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
