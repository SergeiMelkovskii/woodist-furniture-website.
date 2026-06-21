'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n';
import type { Settings } from '@/lib/types';
import { t as tr } from '@/lib/utils';

export default function Hero({
  settings,
  locale,
}: {
  settings: Settings;
  locale: Locale;
}) {
  const t = useTranslations('home');
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const hasImage = !!settings.hero.image;
  const slogan = tr(settings.hero.slogan, locale);
  const eyebrow = settings.hero.eyebrow ? tr(settings.hero.eyebrow, locale) : '';

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] w-full items-end overflow-hidden bg-ink text-bone"
    >
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        {hasImage ? (
          <Image
            src={settings.hero.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="placeholder-interior absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="grain absolute inset-0 opacity-10" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="container-wide relative z-10 pb-20 pt-32 sm:pb-28 sm:pt-40"
      >
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8 text-xs font-medium uppercase tracking-[0.3em] text-taupe-300"
          >
            {eyebrow}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="display-1 max-w-[20ch] text-balance text-bone"
        >
          {slogan}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-bone/60"
        >
          <span className="h-px w-12 bg-bone/30" />
          {t('scroll')}
        </motion.div>
      </motion.div>
    </section>
  );
}
