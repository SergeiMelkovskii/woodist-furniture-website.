import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import ProjectCard from '@/components/ProjectCard';
import CraftsmanshipProcess from '@/components/CraftsmanshipProcess';
import ContactCTA from '@/components/ContactCTA';
import RevealOnScroll from '@/components/RevealOnScroll';
import { getProducts, getProjects, getSettings } from '@/lib/content';
import { t as tr } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const [products, projects, settings] = await Promise.all([
    getProducts(),
    getProjects(),
    getSettings(),
  ]);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);
  const display = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 2);

  return (
    <>
      <Hero settings={settings} locale={locale} />

      <section className="container-wide py-32 sm:py-40">
        <RevealOnScroll className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="eyebrow mb-6">— 01</div>
            <h2 className="display-2 text-balance">{t('aboutTitle')}</h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            <p className="text-pretty text-lg leading-relaxed text-ink/75 sm:text-xl">
              {tr(settings.about, locale)}
            </p>
          </div>
        </RevealOnScroll>
      </section>

      <section className="container-wide pb-32 sm:pb-40">
        <RevealOnScroll className="mb-16 flex items-end justify-between gap-6">
          <div>
            <div className="eyebrow mb-6">— 02</div>
            <h2 className="display-2 text-balance">{t('collectionsTitle')}</h2>
            <p className="mt-4 max-w-md text-ink/60">{t('collectionsSubtitle')}</p>
          </div>
          <Link
            href={`/${locale}/products`}
            className="hidden link-underline shrink-0 text-sm uppercase tracking-widest sm:inline-block"
          >
            {t('viewAll')} →
          </Link>
        </RevealOnScroll>

        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {display.map((product, i) => (
            <RevealOnScroll key={product.id} delay={i * 0.1}>
              <ProductCard product={product} locale={locale} priority={i === 0} />
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="mt-12 text-center sm:hidden">
          <Link href={`/${locale}/products`} className="btn-outline">
            {t('viewAll')}
            <ArrowUpRight size={14} />
          </Link>
        </RevealOnScroll>
      </section>

      <CraftsmanshipProcess
        title={tr(settings.craftsmanship.title, locale)}
        intro={tr(settings.craftsmanship.intro, locale)}
        steps={settings.craftsmanship.steps}
        locale={locale}
      />

      {featuredProjects.length > 0 && (
        <section className="container-wide py-32 sm:py-40">
          <RevealOnScroll className="mb-16 flex items-end justify-between gap-6">
            <div>
              <div className="eyebrow mb-6">— 04</div>
              <h2 className="display-2 text-balance">{t('projectsTitle')}</h2>
              <p className="mt-4 max-w-md text-ink/60">{t('projectsSubtitle')}</p>
            </div>
            <Link
              href={`/${locale}/projects`}
              className="hidden link-underline shrink-0 text-sm uppercase tracking-widest sm:inline-block"
            >
              {t('viewAllProjects')} →
            </Link>
          </RevealOnScroll>

          <div className="grid gap-8 lg:grid-cols-2">
            {featuredProjects.map((project, i) => (
              <RevealOnScroll key={project.id} delay={i * 0.1}>
                <ProjectCard project={project} locale={locale} size="large" />
              </RevealOnScroll>
            ))}
          </div>
        </section>
      )}

      <ContactCTA locale={locale} />
    </>
  );
}
