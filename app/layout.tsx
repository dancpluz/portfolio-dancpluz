import type { Metadata } from 'next';
import { Mukta } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import Providers from './providers';
import ThemeSwitch from '@/components/theme-switcher';
import { ReactLenis } from 'lenis/react';

const mukta = Mukta({
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-text',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const baseNeue = localFont({
  src: '../public/fonts/BaseNeue-SuperExpandedBlack.ttf',
  display: 'swap',
  variable: '--font-heading',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Portfólio Daniel Luz',
  description: 'Bem vindo ao meu portfólio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <body className={`${mukta.variable} ${baseNeue.variable}`}>
        <Providers>
          <ThemeSwitch />
          <ReactLenis root>
            {children}
          </ReactLenis>
        </Providers>
      </body>
    </html>
  );
}
