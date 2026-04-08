import ProductCard from '@/components/ProductCard';
import { Suspense } from 'react';
import Link from 'next/link';
import { Loader2, AlertTriangle } from 'lucide-react';

async function getProducts(category) {
  try {
    // Note: In local dev, relative URLs for fetch work if configured, 
    // but on server-side it typically needs a base URL.
    // We follow your instruction to use relative /api/products paths.
    // If this fails on your specific server, we'll shift to direct DB access.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
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
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter mb-4 flex items-center gap-4">
          {categoryFilter ? (
            <>
              <span className="text-gold">{categoryFilter.toUpperCase()}</span>
              <span className="text-white">COLLECTION</span>
            </>
          ) : 'THE ENTIRE VAULT'}
        </h1>
        {categoryFilter && (
          <Link href="/products" className="text-gold text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center mb-4">
            <span>View All Products</span>
          </Link>
        )}
        <p className="text-gray-400 uppercase tracking-widest text-xs">
          {categoryFilter ? `Exploring ${categoryFilter} curated fashion` : 'Surplus / Thrifted Fashion Collection'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-24 bg-[#111] rounded-3xl border border-white/5">
            <p className="text-gray-500 mb-4 tracking-widest uppercase text-sm">Nothing found in this section.</p>
            <p className="text-gray-600 text-xs text-balance">We're constantly restocking. Check back soon or message us on WhatsApp.</p>
          </div>
        )}
      </div>
    </div>
  );
}
