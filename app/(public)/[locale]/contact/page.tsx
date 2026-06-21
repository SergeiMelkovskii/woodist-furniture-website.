import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Phone, MessageCircle, Send, MapPin, Mail, Clock, Instagram } from 'lucide-react';
import { getSettings } from '@/lib/content';
import { t as tr } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('title') };
}

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const settings = await getSettings();
  const { contact } = settings;

  const phoneDigits = contact.phone.replace(/\D/g, '');
  const waLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`;
  const tgLink = `https://t.me/+${contact.telegram.replace(/\D/g, '')}`;

  const cards = [
    {
      icon: Phone,
      label: t('phone'),
      value: contact.phone,
      href: `tel:+${phoneDigits}`,
    },
    {
      icon: MessageCircle,
      label: t('whatsapp'),
      value: contact.whatsapp,
      href: waLink,
      external: true,
    },
    {
      icon: Send,
      label: t('telegram'),
      value: contact.telegram,
      href: tgLink,
      external: true,
    },
    ...(contact.email
      ? [
          {
            icon: Mail,
            label: t('email'),
            value: contact.email,
            href: `mailto:${contact.email}`,
          },
        ]
      : []),
    ...(contact.instagram
      ? [
          {
            icon: Instagram,
            label: t('instagram'),
            value: `@${contact.instagram.replace('@', '')}`,
            href: `https://instagram.com/${contact.instagram.replace('@', '')}`,
            external: true,
          },
        ]
      : []),
  ];

  return (
    <div className="pt-40 pb-32 sm:pt-48 sm:pb-40">
      <div className="container-wide mb-16 max-w-3xl sm:mb-24">
        <div className="eyebrow mb-6">— {t('title')}</div>
        <h1 className="display-1 text-balance">{t('title')}</h1>
        <p className="mt-8 max-w-lg text-pretty text-lg text-ink/70">
          {t('subtitle')}
        </p>
      </div>

      <div className="container-wide grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="space-y-3">
            {cards.map(({ icon: Icon, label, value, href, external }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className="group flex items-center justify-between gap-6 border-b border-ink/10 py-5 transition-colors hover:border-ink"
              >
                <div className="flex items-center gap-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition-colors group-hover:border-ink group-hover:text-ink">
                    <Icon size={16} />
                  </span>
                  <div>
                    <div className="eyebrow">{label}</div>
                    <div className="mt-1 text-base text-ink/80 group-hover:text-ink">
                      {value}
                    </div>
                  </div>
                </div>
                <span className="text-ink/30 transition-transform group-hover:translate-x-1 group-hover:text-ink">
                  →
                </span>
              </a>
            ))}
          </div>

          <div className="mt-10 border-t border-ink/10 pt-8">
            <div className="flex items-start gap-5">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/70">
                <MapPin size={16} />
              </span>
              <div>
                <div className="eyebrow">{t('address')}</div>
                <p className="mt-1 text-base leading-relaxed text-ink/80">
                  {tr(contact.address, locale)}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-start gap-5">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/70">
                <Clock size={16} />
              </span>
              <div>
                <div className="eyebrow">{t('hours')}</div>
                <p className="mt-1 text-base text-ink/80">{t('hoursValue')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {contact.mapEmbed && (
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-taupe-100 sm:aspect-[4/3] lg:aspect-[5/6]">
              <iframe
                src={contact.mapEmbed}
                title="Map to Woodist workshop"
                className="absolute inset-0 h-full w-full grayscale"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
