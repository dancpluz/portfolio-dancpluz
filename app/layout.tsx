import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import localFont from 'next/font/local'
import "./globals.css";

const publicSans = Public_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const baseNeue = localFont({
  src: './BaseNeue-SuperExpandedBlack.ttf',
  display: 'swap',
  variable: '--font-base',
})

export const metadata: Metadata = {
  title: "Portfólio",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${publicSans.variable} ${baseNeue.variable} sans dark`}>
          {children}
      </body>
    </html>
  );
}
