'use client';

import React, { useState, useRef } from 'react';
import { useToast } from '@/context/ToastContext';
import { Upload, X } from 'lucide-react';

interface ProductImageUploadProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  onUploadingChange?: (isUploading: boolean) => void;
}

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

export default function ProductImageUpload({
  images,
  setImages,
  onUploadingChange,
}: ProductImageUploadProps) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateUploading = (status: boolean) => {
    setUploading(status);
    if (onUploadingChange) {
      onUploadingChange(status);
    }
  };

  const validateAndUploadFiles = async (fileList: FileList | File[]) => {
    const rawFiles = Array.from(fileList);
    if (rawFiles.length === 0) return;

    // Check quota
    const currentCount = images.length;
    if (currentCount >= MAX_IMAGES) {
      showToast('You can upload a maximum of 10 images per product.', 'error');
      return;
    }

    const availableQuota = MAX_IMAGES - currentCount;
    let filesToProcess = rawFiles;

    if (rawFiles.length > availableQuota) {
      showToast('You can upload a maximum of 10 images per product.', 'error');
      filesToProcess = rawFiles.slice(0, availableQuota);
    }

    // Filter and validate files
    const validFiles: File[] = [];

    for (const file of filesToProcess) {
      const typeLower = file.type.toLowerCase();
      const nameLower = file.name.toLowerCase();

      const isValidType =
        ALLOWED_TYPES.includes(typeLower) ||
        ALLOWED_EXTENSIONS.some((ext) => nameLower.endsWith(ext));

      if (!isValidType) {
        showToast('Only JPG, PNG, WEBP and AVIF images are supported.', 'error');
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        showToast(`${file.name} is too large.`, 'error');
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    updateUploading(true);
    let successCount = 0;
    let completedCount = 0;
    const total = validFiles.length;
    const newUploadedUrls: string[] = [];

    setProgressText(`Uploading 1 of ${total}...`);

    // Upload files in parallel
    const uploadPromises = validFiles.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const contentType = res.headers.get('content-type') || '';
        let data: any = {};
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const text = await res.text();
          if (res.status === 413 || text.includes('Request Entity Too Large')) {
            throw new Error(`${file.name} is too large.`);
          }
          throw new Error(text || `Upload failed for ${file.name}`);
        }

        if (res.ok && data.success && data.url) {
          successCount++;
          newUploadedUrls.push(data.url);
        } else {
          showToast(`${file.name} failed to upload.`, 'error');
        }
      } catch (err: any) {
        showToast(err?.message || `${file.name} failed to upload.`, 'error');
      } finally {
        completedCount++;
        if (completedCount <= total) {
          setProgressText(`Uploading ${Math.min(completedCount + 1, total)} of ${total}...`);
        }
      }
    });

    await Promise.all(uploadPromises);

    // Update images state with non-duplicates
    if (newUploadedUrls.length > 0) {
      setImages((prev) => {
        const updated = [...prev];
        for (const url of newUploadedUrls) {
          if (!updated.includes(url) && updated.length < MAX_IMAGES) {
            updated.push(url);
          }
        }
        return updated;
      });
    }

    if (successCount === total) {
      showToast(
        total === 1
          ? 'Image uploaded successfully.'
          : `${successCount} images uploaded successfully.`,
        'success'
      );
    } else if (successCount > 0) {
      showToast(`${successCount} of ${total} images uploaded successfully.`, 'success');
    }

    updateUploading(false);
    setProgressText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUploadFiles(e.target.files);
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;

    if (images.length >= MAX_IMAGES) {
      showToast('You can upload a maximum of 10 images per product.', 'error');
      return;
    }

    if (trimmed.startsWith('data:image/')) {
      showToast(
        'Base64 image data is not allowed. Please upload via Cloudinary or use image URLs.',
        'error'
      );
      return;
    }

    if (images.includes(trimmed)) {
      showToast('This image URL is already added.', 'error');
      return;
    }

    setImages((prev) => [...prev, trimmed]);
    setNewImageUrl('');
    showToast('Image URL added.', 'success');
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUploadFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
          PRODUCT IMAGES (CLOUDINARY / URLS) *
        </label>
        <span className="text-xs text-[#888888] font-mono">
          {images.length} / {MAX_IMAGES} IMAGES
        </span>
      </div>

      {/* Drag & Drop / Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
          isDragging
            ? 'border-[#111111] bg-[#F8F8F8]'
            : 'border-[#EAEAEA] bg-[#FAFAFA]'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-white border border-[#EAEAEA] flex items-center justify-center text-[#111111] shadow-sm">
            <Upload className="w-5 h-5" />
          </div>

          <div>
            <p className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              DRAG & DROP PRODUCT IMAGES HERE
            </p>
            <p className="text-[11px] text-[#888888] mt-1">
              or select multiple files from your computer (Max 10MB per file, JPG/PNG/WEBP/AVIF)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <label
              className={`bg-[#111111] text-white hover:bg-zinc-800 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 transition-all shadow-sm ${
                uploading || images.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? progressText || 'UPLOADING...' : 'UPLOAD IMAGE FILE'}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                multiple
                disabled={uploading || images.length >= MAX_IMAGES}
                onChange={handleFileChange}
                aria-label="Upload product images"
                className="hidden"
              />
            </label>
          </div>

          {uploading && (
            <div className="w-full max-w-xs pt-2">
              <p className="text-xs font-bold text-[#111111] font-mono animate-pulse">
                {progressText || 'Uploading images...'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* URL Input */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          placeholder="Paste image URL..."
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddImageUrl();
            }
          }}
          disabled={uploading || images.length >= MAX_IMAGES}
          className="flex-1 bg-white border border-[#EAEAEA] text-[#111111] text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#111111] disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleAddImageUrl}
          disabled={uploading || images.length >= MAX_IMAGES}
          className="bg-[#F8F8F8] border border-[#EAEAEA] hover:border-[#111111] text-[#111111] font-bold text-xs px-4 py-2.5 rounded-xl uppercase transition-colors disabled:opacity-50"
        >
          ADD URL
        </button>
      </div>

      {/* Previews Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-3">
          {images.map((img, idx) => (
            <div
              key={`${img}-${idx}`}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F8F8F8] border border-[#EAEAEA] group shadow-sm"
            >
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={idx === 0 ? 'Primary Product Image' : `Product Image ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Primary Badge */}
              {idx === 0 && (
                <div className="absolute top-2 left-2 bg-[#111111] text-white text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded-md shadow-md z-10">
                  PRIMARY IMAGE
                </div>
              )}

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(idx)}
                disabled={uploading}
                aria-label="Remove image"
                className="absolute top-2 right-2 bg-[#111111]/80 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors opacity-90 sm:opacity-0 group-hover:opacity-100 z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Index indicator */}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
