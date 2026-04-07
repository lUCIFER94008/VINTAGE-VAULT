import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-8 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-gold mb-2">VINTAGE.VAULT</h1>
          <p className="text-gray-400 text-sm">Timeless Style. Sustainable Fashion.</p>
          <p className="text-gray-500 text-xs mt-2">Perumbavoor, Kerala | Shipping All Over India</p>
        </div>

        <div className="flex flex-col space-y-2 text-xs uppercase tracking-widest text-gray-400">
          <Link href="/products" className="hover:text-gold transition">Shop All</Link>
          <Link href="/login" className="hover:text-gold transition">Login</Link>
        </div>

        <div className="text-center md:text-right">
          <p className="text-xs text-gray-500">© 2026 Designed by{" "}
            <a href="https://r7-olive.vercel.app/" className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">
              R7
            </a>
          </p>
          <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest">COD | Exchange | Replacement available</p>
        </div>
      </div>
    </footer>
  );
}
