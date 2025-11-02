'use client';

import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='data-theme' defaultTheme='system' enableSystem>
      <NuqsAdapter>{children}</NuqsAdapter>
    </ThemeProvider>
  );
}
