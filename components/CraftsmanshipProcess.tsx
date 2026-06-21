'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/lib/i18n';
import type { CraftStep } from '@/lib/types';
import { t as tr } from '@/lib/utils';

export default function CraftsmanshipProcess({
  title,
  intro,
  steps,
  locale,
}: {
  title: string;
  intro: string;
  steps: CraftStep[];
  locale: Locale;
}) {
  const t = useTranslations('craft');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="relative bg-ink py-32 text-bone sm:py-40">
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="container-wide relative">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="eyebrow text-taupe-300">{t('stepLabel')} · 01 — 04</div>
              <h2 className="display-2 mt-6 text-balance text-bone">{title}</h2>
              <p className="mt-8 max-w-md text-pretty text-base leading-relaxed text-bone/70">
                {intro}
              </p>
            </div>
          </div>

          <div className="relative lg:col-span-8">
            <div className="absolute left-[7px] top-0 hidden h-full w-px bg-bone/10 sm:block" />
            <motion.div
              style={{ scaleY: lineScale, transformOrigin: 'top' }}
              className="absolute left-[7px] top-0 hidden h-full w-px bg-taupe sm:block"
            />

            <div className="space-y-20 sm:space-y-24">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.05,
                  }}
                  className="relative pl-0 sm:pl-12"
                >
                  <div className="absolute left-0 top-3 hidden h-4 w-4 -translate-x-[7.5px] rounded-full bg-bone sm:block" />
                  <div className="eyebrow text-taupe-300">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="mt-3 font-display text-3xl leading-tight tracking-tight text-bone sm:text-4xl">
                    {tr(step.title, locale)}
                  </h3>
                  <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-bone/70">
                    {tr(step.description, locale)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
