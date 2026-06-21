'use client';

import { useRef, useState } from 'react';
import { Plus, X, Upload, Loader2 } from 'lucide-react';

export default function ImageUploader({
  images,
  onChange,
  subdir,
}: {
  images: string[];
  onChange: (next: string[]) => void;
  subdir: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append('file', file);
        form.append('subdir', subdir);
        const res = await fetch('/api/upload', { method: 'POST', body: form });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Upload failed (${res.status})`);
        }
        const data = await res.json();
        uploaded.push(data.url);
      }
      onChange([...images, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = (i: number) => {
    onChange(images.filter((_, idx) => idx !== i));
  };

  const move = (i: number, dir: -1 | 1) => {
    const next = [...images];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  };

  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-widest text-ink/60">
        Images
      </label>
      <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((src, i) => (
          <div key={src} className="group relative aspect-square overflow-hidden bg-taupe-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink/80 text-bone opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-1 left-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded-sm bg-ink/80 px-2 py-0.5 text-[10px] text-bone disabled:opacity-30"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === images.length - 1}
                className="rounded-sm bg-ink/80 px-2 py-0.5 text-[10px] text-bone disabled:opacity-30"
              >
                →
              </button>
            </div>
            {i === 0 && (
              <span className="absolute left-1 top-1 rounded-sm bg-bone/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-ink">
                Cover
              </span>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-2 border border-dashed border-ink/30 text-ink/50 transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
          <span className="text-[10px] uppercase tracking-widest">
            {uploading ? 'Uploading…' : 'Add image'}
          </span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={(e) => onFiles(e.target.files)}
      />
      <p className="mt-2 text-xs text-ink/50">
        <Upload size={11} className="mr-1 inline" />
        JPG, PNG, WEBP up to 12 MB · first image is used as cover · hover to remove or reorder
      </p>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
