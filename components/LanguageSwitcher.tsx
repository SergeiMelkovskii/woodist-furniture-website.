'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher({
  locale,
  variant = 'light',
}: {
  locale: Locale;
  variant?: 'light' | 'dark';
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  const onChoose = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/') || `/${next}`);
  };

  const styles =
    variant === 'dark'
      ? 'text-bone hover:text-white'
      : 'text-ink hover:text-taupe-700';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium uppercase tracking-widest transition-colors',
          styles,
        )}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {localeNames[locale]}
        <ChevronDown
          size={12}
          className={cn('transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 min-w-[80px] overflow-hidden rounded-sm border border-ink/10 bg-bone py-1 shadow-xl"
        >
          {locales.map((l) => (
            <button
              key={l}
              role="menuitem"
              onClick={() => onChoose(l)}
              className={cn(
                'block w-full px-4 py-2 text-left text-xs font-medium uppercase tracking-widest transition-colors',
                l === locale
                  ? 'bg-ink text-bone'
                  : 'text-ink hover:bg-ink/5',
              )}
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
