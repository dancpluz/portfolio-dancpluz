import { cookies, headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { i18nLogger } from '@/lib/logger';

// Automatically detects the best language for the user
export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get('locale')?.value;

  let locale = cookieLocale;

  if (locale) {
    i18nLogger.debug(`[i18n] Locale resolved from cookie: ${locale}`);
  } else {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      const preferredLanguage = acceptLanguage.split(',')[0].split('-')[0];
      
      if (['en', 'pt'].includes(preferredLanguage)) {
        locale = preferredLanguage;
        i18nLogger.debug(`[i18n] Locale resolved from accept-language header: ${locale}`);
      }
    }
  }

  if (!locale) {
    locale = 'en';
    i18nLogger.debug(`[i18n] No locale detected, falling back to default: ${locale}`);
  }

  try {
    return {
      locale,
      messages: (await import(`./${locale}`)).default
    };
  } catch (err) {
    i18nLogger.error(`[i18n] Failed to load messages for locale "${locale}": ${err}`);
    return {
      locale: 'en',
      messages: (await import('./en')).default
    };
  }
});

