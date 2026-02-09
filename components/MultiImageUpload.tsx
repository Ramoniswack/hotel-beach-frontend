'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface MultiImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
  className?: string;
}

export default function MultiImageUpload({ 
  value = [], 
  onChange, 
  label, 
  maxImages = 10,
  className = '' 
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check max images limit
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Each file must be less than 5MB');
        return;
      }
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const response = await api.post('/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newUrls = response.data.files.map((f: any) => f.url);
      const updatedImages = [...images, ...newUrls];
      setImages(updatedImages);
      onChange(updatedImages);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Error uploading images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onChange(updatedImages);
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative group">
            <img 
              src={url} 
              alt={`Image ${index + 1}`} 
              className="w-full h-32 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <div className="border-2 border-dashed border-gray-300 rounded hover:border-gray-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-32 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin mb-1" size={24} />
                  <span className="text-xs">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={24} className="mb-1" />
                  <span className="text-xs">Add Images</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        {images.length} / {maxImages} images uploaded
      </p>
    </div>
  );
}
