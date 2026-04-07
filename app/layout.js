import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'VINTAGE.VAULT | Timeless Style. Sustainable Fashion.',
  description: 'Premium Surplus & Thrifted Fashion store based in Perumbavoor, Kerala. Shipping all over India.',
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
      </body>
    </html>
  );
}
