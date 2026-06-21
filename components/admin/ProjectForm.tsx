'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Save, Trash2, ArrowLeft } from 'lucide-react';
import LocalizedField from './LocalizedField';
import ImageUploader from './ImageUploader';
import type { Project } from '@/lib/types';
import type { Localized } from '@/lib/utils';

const emptyLocalized: Localized = { en: '', ru: '', tr: '' };

export default function ProjectForm({
  initial,
  mode,
}: {
  initial?: Project;
  mode: 'create' | 'edit';
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState<Localized>(initial?.title ?? emptyLocalized);
  const [description, setDescription] = useState<Localized>(initial?.description ?? emptyLocalized);
  const [location, setLocation] = useState(initial?.location ?? '');
  const [year, setYear] = useState<string>(String(initial?.year ?? ''));
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [order, setOrder] = useState<string>(String(initial?.order ?? ''));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title,
        description,
        location: location || undefined,
        year: year ? Number(year) : undefined,
        images,
        featured,
        order: order ? Number(order) : undefined,
      };
      const url = mode === 'create' ? '/api/projects' : `/api/projects/${initial!.id}`;
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
      router.push('/admin/projects');
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!initial || !confirm(`Delete "${initial.title.en}"?`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/projects/${initial.id}`, { method: 'DELETE' });
      router.push('/admin/projects');
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink/50 hover:text-ink"
        >
          <ArrowLeft size={14} />
          Back to projects
        </Link>
        <h1 className="mt-4 font-display text-4xl tracking-tight">
          {mode === 'create' ? 'New project' : `Edit · ${initial!.title.en}`}
        </h1>
      </div>

      <section className="space-y-6 border border-ink/10 bg-bone p-6">
        <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
          Basics
        </div>
        <LocalizedField label="Title" value={title} onChange={setTitle} required />
        <LocalizedField
          label="Description"
          value={description}
          onChange={setDescription}
          textarea
          rows={6}
          required
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-ink/60">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Girne, North Cyprus"
              className="mt-2 w-full rounded-sm border border-ink/15 bg-bone px-4 py-3 text-sm focus:border-ink focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-ink/60">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
              className="mt-2 w-full rounded-sm border border-ink/15 bg-bone px-4 py-3 text-sm focus:border-ink focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6 border border-ink/10 bg-bone p-6">
        <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
          Photos
        </div>
        <ImageUploader images={images} onChange={setImages} subdir="projects" />
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
          {saving ? 'Saving…' : mode === 'create' ? 'Create project' : 'Save changes'}
        </button>
        <Link href="/admin/projects" className="btn-ghost">
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
