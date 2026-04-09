'use client';

import { ThemeProvider } from 'next-themes';
import { LazyMotion, domAnimation } from 'motion/react';
import { useMagicalUnderline } from '@/hooks/use-magical-underline';

export default function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useMagicalUnderline();

  return (
    <LazyMotion features={domAnimation}>
      <ThemeProvider attribute='data-theme' defaultTheme='system' enableSystem>
        {children}
      </ThemeProvider>
    </LazyMotion>
  );
}
