import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { ReactLenis } from 'lenis/react';
import Header from '@/components/header';
import ClientProviders from './client-providers';
import ServerProviders from './server-providers';

// const mukta = Share_Tech({
//   weight: ['400', '500', '600', '700'],
//   variable: '--font-text',
//   subsets: ['latin'],
//   display: 'swap',
//   preload: false,
// });

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-text',
  preload: true,
});

// const offBitDot = localFont({
//   src: [
//     {
//       path: '../public/fonts/OffBit-Dot.ttf',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: '../public/fonts/OffBit-DotBold.ttf',
//       weight: '700',
//       style: 'normal',
//     },
//   ],
//   display: 'swap',
//   variable: '--font-heading',
//   preload: true,
// });

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
            <Header />
            <ReactLenis root>{children}</ReactLenis>
          </ClientProviders>
        </ServerProviders>
      </body>
    </html>
  );
}
