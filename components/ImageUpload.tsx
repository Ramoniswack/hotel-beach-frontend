'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, label, className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload/single', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.url;
      setPreview(imageUrl);
      onChange(imageUrl);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex flex-col items-center justify-center w-full py-8 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin mb-2" size={32} />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={32} className="mb-2" />
                  <span className="text-sm">Click to upload image</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
