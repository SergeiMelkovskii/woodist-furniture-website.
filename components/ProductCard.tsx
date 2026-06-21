'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import PlaceholderArt from './PlaceholderArt';
import type { Locale } from '@/lib/i18n';
import type { Product } from '@/lib/types';
import { t as tr } from '@/lib/utils';

export default function ProductCard({
  product,
  locale,
  priority = false,
}: {
  product: Product;
  locale: Locale;
  priority?: boolean;
}) {
  const t = useTranslations('products');
  const image = product.images[0];
  const categoryLabel = t(product.category);
  const name = tr(product.name, locale);

  return (
    <Link
      href={`/${locale}/products/${product.id}`}
      className="group block"
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-[4/5] w-full overflow-hidden bg-taupe-100"
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <PlaceholderArt label={name} category={categoryLabel} />
        )}
        <div className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-bone/0 text-bone backdrop-blur-sm transition-all duration-500 group-hover:bg-ink group-hover:text-bone">
          <ArrowUpRight
            size={16}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          />
        </div>
      </motion.div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">{categoryLabel}</div>
          <h3 className="font-display text-2xl leading-tight tracking-tight transition-colors group-hover:text-taupe-700">
            {name}
          </h3>
        </div>
        {product.price && (
          <div className="shrink-0 pt-1 text-xs uppercase tracking-widest text-ink/60">
            {product.price === 'On request' ? t('onRequest') : product.price}
          </div>
        )}
      </div>
    </Link>
  );
}
