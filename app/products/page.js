import ProductCard from "@/components/ProductCard";

async function getProducts() {
  try {
    // Note: Server-side fetch requires absolute URLs. 
    // NEXT_PUBLIC_BASE_URL handles both local development and Vercel deployment.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();

    // Supports both {success: true, data: []} and raw array responses
    return data.data || data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="pt-32 pb-20 px-6 max-w-[1300px] mx-auto text-white">
      {/* 🔥 TITLE */}
      <div className="mb-10 flex items-center space-x-4">
         <div className="h-12 w-2 bg-gold" />
         <h1 className="text-4xl font-black italic uppercase tracking-tighter">
           The Entire Vault
         </h1>
      </div>

      {/* 🔥 GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-24 bg-[#0a0a0a] rounded-3xl border border-white/5 border-dashed">
             <div className="text-gray-700 font-black text-6xl mb-4 opacity-50 uppercase tracking-tighter italic">Empty Vault</div>
             <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">No products detected. Check back for fresh inventory.</p>
          </div>
        )}
      </div>
    </div>
  );
}
