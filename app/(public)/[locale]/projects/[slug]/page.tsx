import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { getProject, getProjects, getSettings } from '@/lib/content';
import PlaceholderArt from '@/components/PlaceholderArt';
import { t as tr } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { slug: string; locale: Locale };
}): Promise<Metadata> {
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: tr(project.title, locale),
    description: tr(project.description, locale),
  };
}

export default async function ProjectDetailPage({
  params: { slug, locale },
}: {
  params: { slug: string; locale: Locale };
}) {
  setRequestLocale(locale);
  const project = await getProject(slug);
  if (!project) notFound();

  const t = await getTranslations('projects');
  const settings = await getSettings();
  const title = tr(project.title, locale);
  const description = tr(project.description, locale);
  const waLink = `https://wa.me/${settings.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hi Woodist — I'd like to discuss a project, inspired by ${title}.`,
  )}`;

  return (
    <article className="pt-32 pb-32 sm:pt-40">
      <div className="container-wide">
        <Link
          href={`/${locale}/projects`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-ink/50 transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} />
          {t('back')}
        </Link>

        <header className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="eyebrow mb-6 flex gap-6">
              {project.location && <span>{project.location}</span>}
              {project.year && <span>{project.year}</span>}
            </div>
            <h1 className="display-1 text-balance">{title}</h1>
          </div>
          <div className="lg:col-span-4 lg:pl-8">
            <p className="text-pretty text-base leading-relaxed text-ink/70 sm:text-lg">
              {description}
            </p>
          </div>
        </header>

        <div className="mt-16 sm:mt-24">
          {project.images.length === 0 ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink">
              <PlaceholderArt
                label={title}
                category={project.location}
                variant="interior"
              />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink">
                <Image
                  src={project.images[0]}
                  alt={title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              {project.images.length > 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.images.slice(1).map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] w-full overflow-hidden bg-ink"
                    >
                      <Image
                        src={src}
                        alt={`${title} — ${i + 2}`}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <section className="mt-24 border-t border-ink/10 pt-16 text-center">
          <h2 className="display-3 mx-auto max-w-2xl text-balance">
            {t('ctaTitle')}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-ink/70">
            {t('ctaBody')}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              <MessageCircle size={16} />
              {t('ctaCall')}
            </a>
            <Link href={`/${locale}/contact`} className="btn-outline">
              {t('ctaContact')}
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
