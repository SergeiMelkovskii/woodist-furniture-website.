import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { getProduct, getProducts, getSettings } from '@/lib/content';
import PlaceholderArt from '@/components/PlaceholderArt';
import { t as tr } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params: { id, locale },
}: {
  params: { id: string; locale: Locale };
}): Promise<Metadata> {
  const product = await getProduct(id);
  if (!product) return {};
  return {
    title: tr(product.name, locale),
    description: tr(product.description, locale),
  };
}

export default async function ProductDetailPage({
  params: { id, locale },
}: {
  params: { id: string; locale: Locale };
}) {
  setRequestLocale(locale);
  const product = await getProduct(id);
  if (!product) notFound();

  const t = await getTranslations('products');
  const settings = await getSettings();
  const name = tr(product.name, locale);
  const description = tr(product.description, locale);
  const categoryLabel = t(product.category);
  const waLink = `https://wa.me/${settings.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hi Woodist — I'd like to enquire about: ${name}`,
  )}`;

  return (
    <article className="pt-32 pb-32 sm:pt-40">
      <div className="container-wide">
        <Link
          href={`/${locale}/products`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink/50 transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} />
          {t('back')}
        </Link>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-taupe-100">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <PlaceholderArt label={name} category={categoryLabel} />
              )}
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
                {product.images.slice(1).map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden bg-taupe-100"
                  >
                    <Image
                      src={src}
                      alt={`${name} — ${i + 2}`}
                      fill
                      sizes="(min-width: 640px) 20vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="eyebrow mb-6">{categoryLabel}</div>
              <h1 className="display-2 text-balance">{name}</h1>
              <p className="mt-8 text-pretty text-lg leading-relaxed text-ink/70">
                {description}
              </p>

              <dl className="mt-12 space-y-6 border-t border-ink/10 pt-8">
                {product.materials && (
                  <div>
                    <dt className="eyebrow mb-2">{t('materials')}</dt>
                    <dd className="text-ink/80">{tr(product.materials, locale)}</dd>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <dt className="eyebrow mb-2">{t('dimensions')}</dt>
                    <dd className="text-ink/80">{product.dimensions}</dd>
                  </div>
                )}
                {product.price && (
                  <div>
                    <dt className="eyebrow mb-2">{t('price')}</dt>
                    <dd className="text-ink/80">
                      {product.price === 'On request' ? t('onRequest') : product.price}
                    </dd>
                  </div>
                )}
              </dl>

              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="btn-primary mt-10 w-full sm:w-auto"
              >
                <MessageCircle size={16} />
                {t('enquire')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
