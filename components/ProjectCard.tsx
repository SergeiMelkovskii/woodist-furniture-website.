'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import PlaceholderArt from './PlaceholderArt';
import type { Locale } from '@/lib/i18n';
import type { Project } from '@/lib/types';
import { t as tr } from '@/lib/utils';

export default function ProjectCard({
  project,
  locale,
  size = 'default',
}: {
  project: Project;
  locale: Locale;
  size?: 'default' | 'large';
}) {
  const image = project.images[0];
  const title = tr(project.title, locale);
  const aspect = size === 'large' ? 'aspect-[16/10]' : 'aspect-[4/3]';

  return (
    <Link href={`/${locale}/projects/${project.id}`} className="group block">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full overflow-hidden bg-ink ${aspect}`}
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <PlaceholderArt
            label={title}
            category={project.location}
            variant="interior"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div className="text-bone">
              <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-bone/60">
                {project.location}
                {project.year && <span className="ml-3">{project.year}</span>}
              </div>
              <h3 className="font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                {title}
              </h3>
            </div>
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bone/30 text-bone transition-all duration-500 group-hover:bg-bone group-hover:text-ink sm:inline-flex">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
