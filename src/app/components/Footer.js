"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="py-12 border-t border-white/10 bg-slate-950 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-fuchsia-600 flex items-center justify-center font-bold text-white text-sm">
            A
          </div>
          <span className="text-xl font-black text-white">AngeBingo</span>
        </div>
        <div className="flex gap-6 text-sm flex-wrap justify-center">
          <Link href="/how-to-play" className="hover:text-fuchsia-300 transition-colors">How to Play</Link>
          <Link href="/services" className="hover:text-fuchsia-300 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-fuchsia-300 transition-colors">Privacy Policy</Link>
          <Link href="/support" className="hover:text-fuchsia-300 transition-colors">Support</Link>
        </div>
        <p className="text-sm">© 2026 AngeBingo. All rights reserved.</p>
      </div>
    </footer>
  );
}
