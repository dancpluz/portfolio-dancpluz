import { NextIntlClientProvider } from 'next-intl';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function ServerProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextIntlClientProvider>
      <NuqsAdapter>
        {children}
      </NuqsAdapter>
    </NextIntlClientProvider>
  );
}
