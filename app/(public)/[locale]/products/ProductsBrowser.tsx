'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import ProductCard from '@/components/ProductCard';
import { productCategories, type Product, type ProductCategory } from '@/lib/types';
import type { Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Filter = 'all' | ProductCategory;

export default function ProductsBrowser({
  products,
  locale,
}: {
  products: Product[];
  locale: Locale;
}) {
  const t = useTranslations('products');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return products;
    return products.filter((p) => p.category === filter);
  }, [products, filter]);

  const filters: Filter[] = ['all', ...productCategories];

  return (
    <div>
      <div className="mb-12 flex flex-wrap items-center gap-2 border-b border-ink/10 pb-4 sm:gap-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'relative px-4 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors',
              filter === f ? 'text-ink' : 'text-ink/40 hover:text-ink/70',
            )}
          >
            {t(f)}
            {filter === f && (
              <motion.div
                layoutId="active-filter"
                className="absolute -bottom-[17px] left-0 right-0 h-px bg-ink"
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </button>
        ))}
        <span className="ml-auto text-xs uppercase tracking-widest text-ink/40">
          {filtered.length}
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[40vh] items-center justify-center text-ink/40"
          >
            {t('empty')}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            layout
            className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={product} locale={locale} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
