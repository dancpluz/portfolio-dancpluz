import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { ReactLenis } from 'lenis/react';
import Header from '@/components/header/header';
import ClientProviders from './client-providers';
import ServerProviders from './server-providers';
import Preloader from '@/components/ui/preloader';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-text',
  preload: true,
});

const offBit = localFont({
  src: [
    {
      path: '../public/fonts/OffBit-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/OffBit-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/OffBit-Dot.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/OffBit-DotBold.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
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
      <body className={`${inter.variable} ${offBit.variable}`}>
        <ServerProviders>
          <ClientProviders>
            <Preloader />
            <Header />
            <ReactLenis root>{children}</ReactLenis>
          </ClientProviders>
        </ServerProviders>
      </body>
    </html>
  );
}
