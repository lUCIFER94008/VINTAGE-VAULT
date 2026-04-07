import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'VINTAGE.VAULT | Timeless Style. Sustainable Fashion.',
  description: 'Premium Surplus & Thrifted Fashion store based in Perumbavoor, Kerala. Shipping all over India.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-black text-white`}>
        <Navbar />
        <main className="min-height-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
