import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { t as tr } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';
import type { Settings } from '@/lib/types';

export default function Footer({
  locale,
  settings,
}: {
  locale: Locale;
  settings: Settings;
}) {
  const t = useTranslations();
  const year = new Date().getFullYear();
  const { contact } = settings;
  const waLink = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`;
  const tgLink = `https://t.me/+${contact.telegram.replace(/\D/g, '')}`;

  return (
    <footer className="relative mt-32 border-t border-ink/10 bg-bone pt-20 pb-10">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-balance text-base leading-relaxed text-ink/70">
              {tr(settings.about, locale)}
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <div className="eyebrow mb-5">{t('contact.address')}</div>
            <p className="leading-relaxed text-ink/80">{tr(contact.address, locale)}</p>
          </div>

          <div className="lg:col-span-3">
            <div className="eyebrow mb-5">{t('contact.messageUs')}</div>
            <ul className="space-y-2 text-ink/80">
              <li>
                <a className="link-underline" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                  {contact.phone}
                </a>
              </li>
              <li>
                <a className="link-underline" href={waLink} target="_blank" rel="noreferrer">
                  WhatsApp · {contact.whatsapp}
                </a>
              </li>
              <li>
                <a className="link-underline" href={tgLink} target="_blank" rel="noreferrer">
                  Telegram · {contact.telegram}
                </a>
              </li>
              {contact.email && (
                <li>
                  <a className="link-underline" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.instagram && (
                <li>
                  <a
                    className="link-underline"
                    href={`https://instagram.com/${contact.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram · @{contact.instagram.replace('@', '')}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-ink/10 pt-8 text-xs uppercase tracking-widest text-ink/50 sm:flex-row sm:items-center">
          <div>
            © {year} Woodist · {t('footer.rights')}
          </div>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/contact`} className="hover:text-ink">
              {t('nav.contact')}
            </Link>
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  );
}
