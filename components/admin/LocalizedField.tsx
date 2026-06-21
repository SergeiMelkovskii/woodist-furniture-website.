'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Localized } from '@/lib/utils';

const tabs: Array<{ key: keyof Localized; label: string }> = [
  { key: 'en', label: 'EN' },
  { key: 'ru', label: 'RU' },
  { key: 'tr', label: 'TR' },
];

export default function LocalizedField({
  label,
  value,
  onChange,
  textarea = false,
  rows = 4,
  required = false,
}: {
  label: string;
  value: Localized;
  onChange: (next: Localized) => void;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
}) {
  const [active, setActive] = useState<keyof Localized>('en');

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-widest text-ink/60">
          {label}
          {required && <span className="ml-1 text-taupe-700">*</span>}
        </label>
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={cn(
                'rounded-sm px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest transition-colors',
                active === tab.key
                  ? 'bg-ink text-bone'
                  : 'bg-transparent text-ink/40 hover:bg-ink/5 hover:text-ink',
              )}
            >
              {tab.label}
              {value[tab.key]?.trim() ? '' : ' ○'}
            </button>
          ))}
        </div>
      </div>
      {textarea ? (
        <textarea
          value={value[active]}
          onChange={(e) => onChange({ ...value, [active]: e.target.value })}
          rows={rows}
          required={required && active === 'en'}
          className="mt-2 w-full rounded-sm border border-ink/15 bg-bone px-4 py-3 text-sm text-ink transition-colors focus:border-ink focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={value[active]}
          onChange={(e) => onChange({ ...value, [active]: e.target.value })}
          required={required && active === 'en'}
          className="mt-2 w-full rounded-sm border border-ink/15 bg-bone px-4 py-3 text-sm text-ink transition-colors focus:border-ink focus:outline-none"
        />
      )}
    </div>
  );
}
