import React, { useState } from 'react';
import { uploadImage } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2 } from "lucide-react";

export default function ImageUploader({ images, onChange, maxImages = 5 }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const remainingSlots = maxImages - images.length;
    const filesToUpload = files.slice(0, remainingSlots);
    
    setUploading(true);
    
    try {
      const newImageUrls = [];
      for (const file of filesToUpload) {
        const url = await uploadImage(file);
        newImageUrls.push(url);
      }
      onChange([...images, ...newImageUrls]);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            {index === 0 && (
              <span className="absolute bottom-2 left-2 text-xs bg-emerald-600 text-white px-2 py-1 rounded-full">
                Principal
              </span>
            )}
          </div>
        ))}
        
        {images.length < maxImages && (
          <label className="aspect-square rounded-xl border-2 border-dashed border-stone-300 hover:border-emerald-500 cursor-pointer flex flex-col items-center justify-center gap-2 text-stone-400 hover:text-emerald-600 transition-colors">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-8 h-8" />
                <span className="text-xs text-center">Agregar foto</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>
      
      <p className="text-sm text-stone-500">
        {images.length} de {maxImages} fotos. La primera imagen será la principal.
      </p>
    </div>
  );
}
