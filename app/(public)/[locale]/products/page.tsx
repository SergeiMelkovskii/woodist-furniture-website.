import { setRequestLocale, getTranslations } from 'next-intl/server';
import ProductsBrowser from './ProductsBrowser';
import { getProducts } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'products' });
  return { title: t('title') };
}

export default async function ProductsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('products');
  const products = await getProducts();

  return (
    <div className="container-wide pt-40 pb-32 sm:pt-48 sm:pb-40">
      <div className="mb-16 max-w-3xl sm:mb-24">
        <div className="eyebrow mb-6">— {t('title')}</div>
        <h1 className="display-1 text-balance">{t('title')}</h1>
        <p className="mt-8 max-w-lg text-pretty text-lg text-ink/70">
          {t('subtitle')}
        </p>
      </div>

      <ProductsBrowser products={products} locale={locale} />
    </div>
  );
}
