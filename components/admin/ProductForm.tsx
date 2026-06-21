'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Save, Trash2, ArrowLeft } from 'lucide-react';
import LocalizedField from './LocalizedField';
import ImageUploader from './ImageUploader';
import type { Product, ProductCategory } from '@/lib/types';
import { productCategories } from '@/lib/types';
import type { Localized } from '@/lib/utils';

const emptyLocalized: Localized = { en: '', ru: '', tr: '' };

export default function ProductForm({
  initial,
  mode,
}: {
  initial?: Product;
  mode: 'create' | 'edit';
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<ProductCategory>(initial?.category ?? 'couches');
  const [name, setName] = useState<Localized>(initial?.name ?? emptyLocalized);
  const [description, setDescription] = useState<Localized>(initial?.description ?? emptyLocalized);
  const [materials, setMaterials] = useState<Localized>(initial?.materials ?? emptyLocalized);
  const [dimensions, setDimensions] = useState(initial?.dimensions ?? '');
  const [price, setPrice] = useState(initial?.price ?? 'On request');
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [order, setOrder] = useState<string>(String(initial?.order ?? ''));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        category,
        name,
        description,
        materials: materials.en || materials.ru || materials.tr ? materials : undefined,
        dimensions: dimensions || undefined,
        price: price || undefined,
        images,
        featured,
        order: order ? Number(order) : undefined,
      };
      const url = mode === 'create'
        ? '/api/products'
        : `/api/products/${initial!.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error?.formErrors?.join(', ') || body.error || 'Save failed');
        return;
      }
      router.push('/admin/products');
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!initial || !confirm(`Delete "${initial.name.en}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/products/${initial.id}`, { method: 'DELETE' });
      router.push('/admin/products');
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink/50 hover:text-ink"
        >
          <ArrowLeft size={14} />
          Back to products
        </Link>
        <h1 className="mt-4 font-display text-4xl tracking-tight">
          {mode === 'create' ? 'New product' : `Edit · ${initial!.name.en}`}
        </h1>
      </div>

      <section className="space-y-6 border border-ink/10 bg-bone p-6">
        <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
          Basics
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-widest text-ink/60">
            Category
          </label>
          <div className="mt-2 flex gap-2">
            {productCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-sm px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors ${
                  category === c
                    ? 'bg-ink text-bone'
                    : 'border border-ink/20 text-ink/70 hover:border-ink hover:text-ink'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <LocalizedField label="Name" value={name} onChange={setName} required />
        <LocalizedField
          label="Description"
          value={description}
          onChange={setDescription}
          textarea
          required
        />
      </section>

      <section className="space-y-6 border border-ink/10 bg-bone p-6">
        <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
          Specifications (optional)
        </div>
        <LocalizedField
          label="Materials"
          value={materials}
          onChange={setMaterials}
          textarea
          rows={3}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-ink/60">
              Dimensions
            </label>
            <input
              type="text"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. 240 × 240 × 75 cm"
              className="mt-2 w-full rounded-sm border border-ink/15 bg-bone px-4 py-3 text-sm focus:border-ink focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-ink/60">
              Price
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder='e.g. "On request" or "1500 EUR"'
              className="mt-2 w-full rounded-sm border border-ink/15 bg-bone px-4 py-3 text-sm focus:border-ink focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6 border border-ink/10 bg-bone p-6">
        <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
          Photos
        </div>
        <ImageUploader images={images} onChange={setImages} subdir="products" />
      </section>

      <section className="grid gap-6 border border-ink/10 bg-bone p-6 sm:grid-cols-2">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          <span className="text-sm">Feature on home page</span>
        </label>
        <div>
          <label className="text-xs font-medium uppercase tracking-widest text-ink/60">
            Sort order
          </label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="auto"
            className="mt-2 w-full rounded-sm border border-ink/15 bg-bone px-4 py-3 text-sm focus:border-ink focus:outline-none"
          />
        </div>
      </section>

      {error && (
        <div className="rounded-sm border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving…' : mode === 'create' ? 'Create product' : 'Save changes'}
        </button>
        <Link href="/admin/products" className="btn-ghost">
          Cancel
        </Link>
        {mode === 'edit' && (
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="ml-auto inline-flex items-center gap-2 text-sm text-red-700 hover:text-red-900"
          >
            <Trash2 size={14} />
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        )}
      </div>
    </form>
  );
}
