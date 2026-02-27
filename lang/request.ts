import { cookies, headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get('locale')?.value;

  let locale = cookieLocale;

  if (!locale) {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      const preferredLanguage = acceptLanguage.split(',')[0].split('-')[0];
      
      if (['en', 'pt'].includes(preferredLanguage)) {
        locale = preferredLanguage;
      }
    }
  }

  locale = locale || 'en';

  return {
    locale,
    messages: (await import(`./${locale}.json`)).default
  };
});
