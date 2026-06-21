'use client';

import { Loader2, Star, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { uploadImage } from '@/lib/api/upload';

export interface ProductImage {
  url: string;
  alt?: string;
  sortOrder: number;
  isDefault: boolean;
}

interface ImageUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  folder?: string;
}

export function ImageUpload({ images, onChange, folder = 'products' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: ProductImage[] = [];
      for (const file of Array.from(files)) {
        const { url } = await uploadImage(file, folder);
        uploaded.push({ url, alt: '', sortOrder: 0, isDefault: false });
      }
      const next = [...images, ...uploaded].map((img, i) => ({
        ...img,
        sortOrder: i,
        isDefault: false,
      }));
      // First image is default unless one is already chosen.
      if (next.length > 0 && !next.some((i) => i.isDefault)) {
        next[0]!.isDefault = true;
      }
      onChange(next);
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const next = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, sortOrder: i }));
    if (next.length > 0 && !next.some((i) => i.isDefault)) {
      next[0]!.isDefault = true;
    }
    onChange(next);
  };

  const setDefault = (index: number) => {
    onChange(images.map((img, i) => ({ ...img, isDefault: i === index })));
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:opacity-60"
      >
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <Upload className="h-6 w-6" />
            Click to upload images (JPEG/PNG/WEBP, max 5 MB)
          </>
        )}
      </button>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img, i) => (
            <div key={img.url} className="group relative aspect-square overflow-hidden rounded-md border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt || 'Product image'} className="h-full w-full object-cover" />
              {img.isDefault && (
                <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                  Default
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                {!img.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefault(i)}
                    title="Set as default"
                    className="rounded-full bg-background p-1.5 text-foreground hover:bg-accent"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  title="Remove"
                  className="rounded-full bg-background p-1.5 text-destructive hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
