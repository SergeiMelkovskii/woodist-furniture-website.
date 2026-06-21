import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Calendar, MessageCircle } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import RevealOnScroll from '@/components/RevealOnScroll';
import { getProjects, getSettings } from '@/lib/content';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'projects' });
  return { title: t('title') };
}

export default async function ProjectsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('projects');
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);

  const waLink = `https://wa.me/${settings.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hi Woodist — I'd like to discuss a project.`,
  )}`;

  return (
    <div className="pt-40 pb-32 sm:pt-48 sm:pb-40">
      <div className="container-wide mb-16 max-w-3xl sm:mb-24">
        <div className="eyebrow mb-6">— {t('title')}</div>
        <h1 className="display-1 text-balance">{t('title')}</h1>
        <p className="mt-8 max-w-lg text-pretty text-lg text-ink/70">{t('subtitle')}</p>
      </div>

      <div className="container-wide">
        {projects.length === 0 ? (
          <div className="flex min-h-[30vh] items-center justify-center text-ink/40">
            {t('subtitle')}
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {projects.map((project, i) => (
              <RevealOnScroll key={project.id} delay={i * 0.1}>
                <ProjectCard project={project} locale={locale} size="large" />
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>

      <section className="container-wide mt-32 sm:mt-40">
        <RevealOnScroll className="relative overflow-hidden bg-ink p-10 text-bone sm:p-16 lg:p-20">
          <div className="grain absolute inset-0 opacity-[0.04]" />
          <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <div className="eyebrow text-taupe-300">{t('ctaTitle')}</div>
              <h2 className="display-2 mt-6 text-balance text-bone">
                {t('ctaTitle')}
              </h2>
            </div>
            <div className="lg:col-span-6">
              <p className="text-pretty text-base leading-relaxed text-bone/70 sm:text-lg">
                {t('ctaBody')}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn bg-bone text-ink hover:bg-taupe-200"
                >
                  <MessageCircle size={16} />
                  {t('ctaCall')}
                </a>
                <Link
                  href={`/${locale}/contact`}
                  className="btn border border-bone/30 text-bone hover:bg-bone hover:text-ink"
                >
                  <Calendar size={16} />
                  {t('ctaContact')}
                </Link>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
}
