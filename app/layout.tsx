import type { Metadata } from 'next';
import { Mukta } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const mukta = Mukta({
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-text',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const baseNeue = localFont({
  src: './BaseNeue-SuperExpandedBlack.ttf',
  display: 'swap',
  variable: '--font-header',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Lumentosh | Portfólio Daniel Luz',
  description:
    'Bem vindo ao meu portfólio de desenvolvedor, me chamo Daniel Luz e aqui você encontra meus projetos, experiências e tecnologias que já trabalhei.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-br'>
      <body className={`${mukta.variable} ${baseNeue.variable} font-text dark`}>
        {children}
      </body>
    </html>
  );
}
