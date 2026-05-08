"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navigation() {
  const pathname = usePathname();
  const isBackstage = pathname?.includes('/backstage');

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-8 flex justify-between items-center mix-blend-difference text-white pointer-events-auto`}
    >
      <Link href="/" className="text-sm font-bold tracking-[0.3em] uppercase flex items-center">
        <span>PARALLA</span>
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center -ml-[0.2em] mr-[0.4em] text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[1.6em] h-[1.6em]">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </motion.span>
        <span>FRAMES</span>
      </Link>
      
      <div className="flex gap-8 text-xs tracking-[0.2em] uppercase font-medium">
        <Link 
          href="/" 
          className={`hover:opacity-100 transition-opacity ${!isBackstage ? 'opacity-100' : 'opacity-50'}`}
        >
          Mainstage
        </Link>
        <Link 
          href="/backstage" 
          className={`hover:opacity-100 transition-opacity ${isBackstage ? 'opacity-100' : 'opacity-50'}`}
        >
          Backstage
        </Link>
      </div>
    </motion.nav>
  );
}
