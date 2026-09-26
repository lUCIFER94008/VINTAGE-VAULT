'use client';

import React, { useEffect, useState } from 'react';
import { Category } from '@/types';
import { useToast } from '@/context/ToastContext';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // New category form
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      showToast('Category name is required.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, image }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Category "${name}" created successfully!`, 'success');
        setName('');
        setDescription('');
        setImage('');
        setShowForm(false);
        fetchCategories();
      } else {
        showToast(data.message || 'Failed to create category.', 'error');
      }
    } catch (err) {
      showToast('Error creating category.', 'error');
    }
  };

  const handleDeactivateCategory = async (id: string, catName: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`Category "${catName}" deactivated.`, 'info');
        fetchCategories();
      }
    } catch (err) {
      showToast('Failed to deactivate category.', 'error');
    }
  };

  return (
    <div className="bg-white space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEAEA] pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#25D366] uppercase">
            VAULT TAXONOMY
          </span>
          <h1 className="text-3xl font-black text-[#111111] uppercase tracking-tight">
            CATEGORY MANAGEMENT
          </h1>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#111111] hover:bg-zinc-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl uppercase tracking-wider flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>ADD CATEGORY</span>
        </button>
      </div>

      {/* Add Category Form Modal */}
      {showForm && (
        <form onSubmit={handleCreateCategory} className="p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase text-[#111111]">CREATE NEW CATEGORY</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <input
              type="text"
              placeholder="Category Name (e.g. Hoodies & Sweats)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border border-[#EAEAEA] text-[#111111] rounded-xl p-3 focus:outline-none focus:border-[#111111]"
              required
            />
            <input
              type="text"
              placeholder="Image URL..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="bg-white border border-[#EAEAEA] text-[#111111] rounded-xl p-3 focus:outline-none focus:border-[#111111]"
            />
            <input
              type="text"
              placeholder="Category Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="sm:col-span-2 bg-white border border-[#EAEAEA] text-[#111111] rounded-xl p-3 focus:outline-none focus:border-[#111111]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-[#F8F8F8] border border-[#EAEAEA] text-[#666666] text-xs font-bold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold uppercase shadow-sm"
            >
              SAVE CATEGORY
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id || cat.slug}
            className="p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-[#111111] uppercase tracking-widest font-mono">
                  /{cat.slug}
                </span>
                <button
                  onClick={() => handleDeactivateCategory(cat._id, cat.name)}
                  className="p-1.5 text-[#888888] hover:text-[#DC2626] transition-colors"
                  title="Deactivate Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-xl font-black text-[#111111] uppercase mt-1">{cat.name}</h3>
              <p className="text-xs text-[#666666] mt-2 line-clamp-2">{cat.description}</p>
            </div>

            <div className="pt-3 border-t border-[#EAEAEA] flex justify-between items-center text-xs">
              <span className="text-[#888888] font-mono">
                {cat.itemCount || 0} Products in Category
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200 uppercase">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
