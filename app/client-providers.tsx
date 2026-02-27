'use client';

import { ThemeProvider } from 'next-themes';
import { LazyMotion, domAnimation } from 'motion/react';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <ThemeProvider attribute='data-theme' defaultTheme='system' enableSystem>
        {children}
      </ThemeProvider>
    </LazyMotion>
  );
}
