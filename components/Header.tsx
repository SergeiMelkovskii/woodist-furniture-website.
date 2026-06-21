'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';

export default function Header({ locale }: { locale: Locale }) {
  const t = useTranslations('nav');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const items = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/products`, label: t('products') },
    { href: `/${locale}/projects`, label: t('projects') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-500',
          scrolled
            ? 'bg-bone/85 backdrop-blur-md border-b border-ink/5'
            : 'bg-transparent',
        )}
      >
        <div className="container-wide flex h-20 items-center justify-between">
          <Link
            href={`/${locale}`}
            aria-label="Woodist home"
            className="text-ink transition-opacity hover:opacity-70"
          >
            <Logo />
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium uppercase tracking-widest text-ink/70 transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <LanguageSwitcher locale={locale} />
            </div>
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center text-ink md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bone text-ink md:hidden">
          <div className="container-wide flex h-20 items-center justify-between">
            <Link href={`/${locale}`} onClick={() => setOpen(false)}>
              <Logo />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="container-wide mt-6 flex flex-1 flex-col gap-1 pb-12">
            {items.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block border-b border-ink/10 py-6 font-display text-4xl tracking-tight transition-opacity hover:opacity-60"
                style={{ animation: `fadeUp 0.6s ${i * 70}ms both` }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-auto pt-8">
              <LanguageSwitcher locale={locale} />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
