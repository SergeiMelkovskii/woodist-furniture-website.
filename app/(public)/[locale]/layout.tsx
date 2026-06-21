import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { getSettings } from '@/lib/content';
import { t } from '@/lib/utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LenisProvider from '@/components/LenisProvider';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const settings = await getSettings();
  const title = 'Woodist — Timeless Wood Design';
  const description = t(settings.about, locale);

  return {
    title: {
      default: title,
      template: '%s · Woodist',
    },
    description,
    icons: {
      icon: '/images/favicon.svg',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale,
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();
  const settings = await getSettings();

  return (
    <html lang={locale} className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-bone text-ink antialiased">
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <Header locale={locale as Locale} />
            <main>{children}</main>
            <Footer locale={locale as Locale} settings={settings} />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
