import { NextIntlClientProvider } from 'next-intl';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactLenis } from 'lenis/react';

export default function ServerProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextIntlClientProvider>
      <NuqsAdapter>
        <ReactLenis root>
          {children}
        </ReactLenis>
      </NuqsAdapter>
    </NextIntlClientProvider>
  );
}
