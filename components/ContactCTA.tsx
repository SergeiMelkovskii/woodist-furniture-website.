import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import RevealOnScroll from './RevealOnScroll';
import type { Locale } from '@/lib/i18n';

export default function ContactCTA({ locale }: { locale: Locale }) {
  const t = useTranslations('home');

  return (
    <section className="container-wide py-32 sm:py-40">
      <RevealOnScroll className="grid items-end gap-12 lg:grid-cols-12">
        <h2 className="display-2 lg:col-span-7 text-balance">{t('ctaTitle')}</h2>
        <div className="lg:col-span-5 lg:pl-12">
          <p className="text-pretty text-base leading-relaxed text-ink/70">
            {t('ctaBody')}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="btn-primary mt-8 group"
          >
            {t('ctaButton')}
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </RevealOnScroll>
    </section>
  );
}
