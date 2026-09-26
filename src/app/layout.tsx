import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VINTAGE VAULT | Jerseys, Jeans & Streetwear',
  description:
    'Timeless Style. Always Wins. Premium 5-sleeve jerseys, vintage wash raw denim jeans, full sleeve woven shirts, socks, caps & retro glasses.',
  keywords: [
    'Vintage Vault',
    'Streetwear',
    '5 Sleeve Jersey',
    'Baggy Jeans',
    'WhatsApp Ordering',
    'Fashion E-Commerce',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light scroll-smooth">
      <body className={`${inter.className} bg-white text-[#111111] antialiased min-h-screen flex flex-col justify-between selection:bg-[#111111] selection:text-white`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
