import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VINTAGE VAULT | Timeless Style',
  description:
    'Premium 5-Sleeve Jerseys, Vintage Raw Jeans & Everyday Streetwear Essentials.',
  icons: {
    icon: 'https://res.cloudinary.com/dpmpefw2p/image/upload/v1790498090/WhatsApp_Image_2026-09-27_at_10.45.42_AM_lygban.png',
    shortcut: 'https://res.cloudinary.com/dpmpefw2p/image/upload/v1790498090/WhatsApp_Image_2026-09-27_at_10.45.42_AM_lygban.png',
    apple: 'https://res.cloudinary.com/dpmpefw2p/image/upload/v1790498090/WhatsApp_Image_2026-09-27_at_10.45.42_AM_lygban.png',
  },
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
