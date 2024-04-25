import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "lumentosh",
  description: "Portfolio Daniel Luz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} relative bg-background text-foreground min-h-screen px-32 pt-40`}>
        <Header/>
        {children}
      </body>
    </html>
  );
}
