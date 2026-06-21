import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from './i18n-config';
import en from '../messages/en.json';
import ru from '../messages/ru.json';
import tr from '../messages/tr.json';

export { locales, defaultLocale, localeNames } from './i18n-config';
export type { Locale } from './i18n-config';

const messages = { en, ru, tr } as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }
  return {
    locale,
    messages: messages[locale as Locale],
  };
});
