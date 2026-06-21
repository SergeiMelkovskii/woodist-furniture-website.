'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import LocalizedField from '@/components/admin/LocalizedField';
import ImageUploader from '@/components/admin/ImageUploader';
import type { Settings, CraftStep } from '@/lib/types';
import type { Localized } from '@/lib/utils';

const emptyLocalized: Localized = { en: '', ru: '', tr: '' };

export default function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const [heroImage, setHeroImage] = useState<string[]>(
    initial.hero.image ? [initial.hero.image] : [],
  );
  const [heroEyebrow, setHeroEyebrow] = useState<Localized>(
    initial.hero.eyebrow ?? emptyLocalized,
  );
  const [heroSlogan, setHeroSlogan] = useState<Localized>(initial.hero.slogan);
  const [about, setAbout] = useState<Localized>(initial.about);

  const [phone, setPhone] = useState(initial.contact.phone);
  const [whatsapp, setWhatsapp] = useState(initial.contact.whatsapp);
  const [telegram, setTelegram] = useState(initial.contact.telegram);
  const [email, setEmail] = useState(initial.contact.email ?? '');
  const [instagram, setInstagram] = useState(initial.contact.instagram ?? '');
  const [mapEmbed, setMapEmbed] = useState(initial.contact.mapEmbed ?? '');
  const [address, setAddress] = useState<Localized>(initial.contact.address);

  const [craftTitle, setCraftTitle] = useState<Localized>(initial.craftsmanship.title);
  const [craftIntro, setCraftIntro] = useState<Localized>(initial.craftsmanship.intro);
  const [steps, setSteps] = useState<CraftStep[]>(initial.craftsmanship.steps);

  const addStep = () => {
    setSteps([...steps, { title: emptyLocalized, description: emptyLocalized }]);
  };
  const removeStep = (i: number) => {
    setSteps(steps.filter((_, idx) => idx !== i));
  };
  const updateStep = (i: number, patch: Partial<CraftStep>) => {
    setSteps(steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: Settings = {
        hero: {
          image: heroImage[0] ?? '',
          eyebrow: heroEyebrow,
          slogan: heroSlogan,
        },
        about,
        contact: {
          phone,
          whatsapp,
          telegram,
          email: email || undefined,
          instagram: instagram || undefined,
          mapEmbed: mapEmbed || undefined,
          address,
        },
        craftsmanship: {
          title: craftTitle,
          intro: craftIntro,
          steps,
        },
      };
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error?.formErrors?.join(', ') || 'Save failed');
        return;
      }
      setSavedAt(Date.now());
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-12">
      <section className="space-y-6 border border-ink/10 bg-bone p-6">
        <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
          Hero
        </div>
        <ImageUploader images={heroImage} onChange={setHeroImage} subdir="hero" />
        <LocalizedField label="Eyebrow (small line above slogan)" value={heroEyebrow} onChange={setHeroEyebrow} />
        <LocalizedField label="Slogan (main headline)" value={heroSlogan} onChange={setHeroSlogan} textarea rows={3} required />
      </section>

      <section className="space-y-6 border border-ink/10 bg-bone p-6">
        <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
          About / brand statement
        </div>
        <LocalizedField label="About paragraph" value={about} onChange={setAbout} textarea rows={4} required />
      </section>

      <section className="space-y-6 border border-ink/10 bg-bone p-6">
        <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
          Contact
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Phone" value={phone} onChange={setPhone} required />
          <Field label="WhatsApp number" value={whatsapp} onChange={setWhatsapp} required />
          <Field label="Telegram number" value={telegram} onChange={setTelegram} required />
          <Field label="Email (optional)" value={email} onChange={setEmail} />
          <Field
            label="Instagram handle (optional)"
            value={instagram}
            onChange={setInstagram}
            placeholder="@woodist"
          />
          <Field
            label="Google Maps embed URL (optional)"
            value={mapEmbed}
            onChange={setMapEmbed}
            placeholder="https://www.google.com/maps?…&output=embed"
          />
        </div>
        <LocalizedField label="Address" value={address} onChange={setAddress} textarea rows={2} required />
      </section>

      <section className="space-y-6 border border-ink/10 bg-bone p-6">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
            Craftsmanship process
          </div>
          <button
            type="button"
            onClick={addStep}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-ink/60 hover:text-ink"
          >
            <Plus size={12} />
            Add step
          </button>
        </div>
        <LocalizedField label="Section title" value={craftTitle} onChange={setCraftTitle} required />
        <LocalizedField
          label="Section intro"
          value={craftIntro}
          onChange={setCraftIntro}
          textarea
          rows={2}
          required
        />

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="rounded-sm border border-ink/10 bg-bone/60 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="text-xs font-medium uppercase tracking-widest text-ink/40">
                  Step {String(i + 1).padStart(2, '0')}
                </div>
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  className="inline-flex items-center gap-1 text-xs text-red-700 hover:text-red-900"
                >
                  <Trash2 size={12} />
                  Remove
                </button>
              </div>
              <div className="space-y-5">
                <LocalizedField
                  label="Step title"
                  value={step.title}
                  onChange={(v) => updateStep(i, { title: v })}
                  required
                />
                <LocalizedField
                  label="Step description"
                  value={step.description}
                  onChange={(v) => updateStep(i, { description: v })}
                  textarea
                  rows={3}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <div className="rounded-sm border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-full border border-ink/10 bg-bone/90 px-6 py-3 shadow-lg backdrop-blur-sm">
        <div className="text-xs text-ink/60">
          {savedAt
            ? `Saved at ${new Date(savedAt).toLocaleTimeString()}`
            : 'Unsaved changes are local only'}
        </div>
        <button type="submit" disabled={saving} className="btn-primary !py-2 !px-5">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-widest text-ink/60">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-ink/15 bg-bone px-4 py-3 text-sm focus:border-ink focus:outline-none"
      />
    </div>
  );
}
