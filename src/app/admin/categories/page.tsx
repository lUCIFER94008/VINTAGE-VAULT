'use client';

import React, { useEffect, useState } from 'react';
import { Category } from '@/types';
import { useToast } from '@/context/ToastContext';
import { Plus, Trash2, Edit3, Upload } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Category form state
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/categories');
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
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

  const resetForm = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImagePreview('');
    setImageFile(null);
    setShowForm(false);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImagePreview(cat.image || '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Please upload a JPG, PNG, or WEBP image under 5MB.', 'error');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const nameLower = file.name.toLowerCase();
    const typeLower = file.type.toLowerCase();

    const isValid =
      allowedTypes.includes(typeLower) ||
      allowedExtensions.some((ext) => nameLower.endsWith(ext));

    if (!isValid) {
      showToast('Please upload a JPG, PNG, or WEBP image under 5MB.', 'error');
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }

    let finalImageUrl = editingCategory?.image || '';

    // If new file selected, upload to Cloudinary
    if (imageFile) {
      setUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('folder', 'vintage-vault/categories');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const contentType = uploadRes.headers.get('content-type') || '';
        let data: any = {};
        if (contentType.includes('application/json')) {
          data = await uploadRes.json();
        } else {
          throw new Error('Category image upload failed. Please try again.');
        }

        if (uploadRes.ok && data.success && data.url) {
          finalImageUrl = data.url;
        } else {
          showToast(data.message || data.error || 'Category image upload failed. Please try again.', 'error');
          setUploadingImage(false);
          return;
        }
      } catch (err: any) {
        showToast(err?.message || 'Category image upload failed. Please try again.', 'error');
        setUploadingImage(false);
        return;
      } finally {
        setUploadingImage(false);
      }
    }

    if (!finalImageUrl) {
      showToast('Category image is required.', 'error');
      return;
    }

    setSavingCategory(true);
    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          image: finalImageUrl,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = {};
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error('Unable to create category. Please try again.');
      }

      if (res.ok && data.success) {
        showToast(
          editingCategory
            ? `Category "${name}" updated successfully!`
            : `Category "${name}" created successfully!`,
          'success'
        );
        resetForm();
        fetchCategories();
      } else {
        showToast(data.message || 'Unable to create category. Please try again.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Unable to create category. Please try again.', 'error');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeactivateCategory = async (id: string, catName: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const contentType = res.headers.get('content-type') || '';
      let data: any = {};
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (res.ok && data.success) {
        showToast(`Category "${catName}" deactivated.`, 'info');
        fetchCategories();
      } else {
        showToast(data.message || 'Failed to deactivate category.', 'error');
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
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="bg-[#111111] hover:bg-zinc-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl uppercase tracking-wider flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'CLOSE FORM' : 'ADD CATEGORY'}</span>
        </button>
      </div>

      {/* Add / Edit Category Form Modal */}
      {showForm && (
        <form onSubmit={handleSaveCategory} className="p-6 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase text-[#111111]">
            {editingCategory ? `EDIT CATEGORY: ${editingCategory.name}` : 'CREATE NEW CATEGORY'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Category Name */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                CATEGORY NAME *
              </label>
              <input
                type="text"
                placeholder="Category Name (e.g. Hoodies & Sweats)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] rounded-xl p-3 focus:outline-none focus:border-[#111111]"
                required
              />
            </div>

            {/* Category Image Upload */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                CATEGORY IMAGE *
              </label>

              {!imagePreview ? (
                <label className="bg-[#F8F8F8] border border-[#EAEAEA] hover:border-[#111111] text-[#111111] text-xs font-bold px-5 py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all w-full sm:w-auto inline-flex">
                  <Upload className="w-4 h-4" />
                  <span>UPLOAD IMAGE</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    aria-label="Upload category image"
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-3">
                  <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-[#F8F8F8] border border-[#EAEAEA] shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="bg-[#111111] text-white hover:bg-zinc-800 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all inline-flex">
                      <Upload className="w-3.5 h-3.5" />
                      <span>CHANGE IMAGE</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleFileChange}
                        aria-label="Upload category image"
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-[#F8F8F8] border border-[#EAEAEA] hover:border-red-300 text-[#DC2626] text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
                CATEGORY DESCRIPTION
              </label>
              <textarea
                rows={3}
                placeholder="Category Description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-[#EAEAEA] text-[#111111] rounded-xl p-3 focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#EAEAEA]">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-xl bg-[#F8F8F8] border border-[#EAEAEA] text-[#666666] text-xs font-bold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={uploadingImage || savingCategory}
              className="px-6 py-2.5 rounded-xl bg-[#111111] text-white text-xs font-bold uppercase shadow-sm disabled:opacity-50"
            >
              {uploadingImage
                ? 'UPLOADING IMAGE...'
                : savingCategory
                ? 'SAVING CATEGORY...'
                : editingCategory
                ? 'UPDATE CATEGORY'
                : 'SAVE CATEGORY'}
            </button>
          </div>
        </form>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id || cat.slug}
            className="p-5 rounded-3xl bg-white border border-[#EAEAEA] shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div>
              {/* Category Image */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-[#F8F8F8] border border-[#EAEAEA] mb-3 flex items-center justify-center">
                {cat.image &&
                !cat.image.includes('unsplash.com') &&
                !cat.image.includes('pexels.com') &&
                !cat.image.includes('placeholder') ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-xs font-bold text-[#888888] uppercase block">
                      NO IMAGE UPLOADED
                    </span>
                    <span className="text-[10px] text-[#AAAAAA] mt-1 block">
                      Upload Cloudinary image via Edit
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-[#111111] uppercase tracking-widest font-mono">
                  /{cat.slug}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditCategory(cat)}
                    className="p-1.5 text-[#888888] hover:text-[#111111] transition-colors"
                    title="Edit Category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeactivateCategory(cat._id, cat.name)}
                    className="p-1.5 text-[#888888] hover:text-[#DC2626] transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-black text-[#111111] uppercase mt-1">{cat.name}</h3>
              <p className="text-xs text-[#666666] mt-1.5 line-clamp-2">{cat.description}</p>
            </div>

            <div className="pt-3 border-t border-[#EAEAEA] flex justify-between items-center text-xs">
              <span className="text-[#888888] font-mono">
                {cat.itemCount || 0} Products in Category
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] border border-emerald-200 uppercase">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
