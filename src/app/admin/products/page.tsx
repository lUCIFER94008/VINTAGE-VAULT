'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/whatsapp';
import { useToast } from '@/context/ToastContext';
import { Plus, Edit3, Trash2, Eye, Search, AlertTriangle } from 'lucide-react';

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?includeInactive=true');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Product "${deleteTarget.name}" deactivated.`, 'success');
        setDeleteTarget(null);
        fetchProducts();
      } else {
        showToast(data.message || 'Failed to delete product.', 'error');
      }
    } catch (err) {
      showToast('Error deleting product.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#25D366] uppercase">
            VAULT INVENTORY
          </span>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
            PRODUCT MANAGEMENT
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="bg-[#111111] hover:bg-zinc-800 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PRODUCT</span>
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter products by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#EAEAEA] text-[#111111] text-xs rounded-xl px-4 py-3 pl-10 focus:outline-none focus:border-[#111111]"
        />
        <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-3" />
      </div>

      {/* Products Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-4">
        {loading ? (
          <div className="p-12 text-center text-[#888888]">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-[#888888]">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#666666]">
              <thead>
                <tr className="border-b border-[#EAEAEA] text-[#888888] font-bold uppercase">
                  <th className="py-3 px-2">IMAGE</th>
                  <th className="py-3 px-2">NAME</th>
                  <th className="py-3 px-2">CATEGORY</th>
                  <th className="py-3 px-2">PRICE</th>
                  <th className="py-3 px-2">STOCK</th>
                  <th className="py-3 px-2">STATUS</th>
                  <th className="py-3 px-2">FLAGS</th>
                  <th className="py-3 px-2 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F8F8F8]">
                    <td className="py-3 px-2">
                      <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-[#F8F8F8] border border-[#EAEAEA]">
                        <Image
                          src={p.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'}
                          alt={p.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="py-3 px-2 font-bold text-[#111111] max-w-[200px] truncate">
                      {p.name}
                    </td>
                    <td className="py-3 px-2 uppercase text-[#666666] font-mono">
                      {p.category.replace(/-/g, ' ')}
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-[#111111]">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="py-3 px-2 font-mono">
                      <span className={p.stock <= 5 ? 'text-[#DC2626] font-bold' : 'text-[#111111]'}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          p.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-1">
                        {p.isFeatured && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            HOT
                          </span>
                        )}
                        {p.isNewArrival && (
                          <span className="bg-[#111111] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${p.slug || p._id}`}
                          target="_blank"
                          className="p-2 bg-white border border-[#EAEAEA] hover:bg-[#F8F8F8] text-[#666666] hover:text-[#111111] rounded-lg transition-colors"
                          title="View Product"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${p._id}/edit`}
                          className="p-2 bg-white border border-[#EAEAEA] hover:bg-[#F8F8F8] text-[#111111] rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-2 bg-red-50 border border-red-200 text-[#DC2626] hover:bg-red-100 rounded-lg transition-colors"
                          title="Deactivate Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="p-6 rounded-3xl bg-white border border-[#EAEAEA] max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#DC2626] flex items-center justify-center mx-auto border border-red-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#111111] uppercase">CONFIRM DEACTIVATION</h3>
            <p className="text-xs text-[#666666]">
              Are you sure you want to deactivate <strong className="text-[#111111]">&quot;{deleteTarget.name}&quot;</strong>? It will no longer appear on the live store catalog.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-[#F8F8F8] border border-[#EAEAEA] text-[#666666] font-bold text-xs py-3 rounded-xl uppercase"
              >
                CANCEL
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 bg-[#DC2626] hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl uppercase"
              >
                {deleting ? 'DEACTIVATING...' : 'DEACTIVATE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
