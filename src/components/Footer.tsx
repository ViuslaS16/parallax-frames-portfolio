'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/raviya_z?igsh=eGE0ZHZscTlrbzJy',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@raviya_z7?_r=1&_t=ZS-96BUTcMxaIW',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1ApTHzDdyC/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#050505] border-t border-zinc-900 px-6 md:px-12 py-5"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">

        {/* Left: brand */}
        <Link href="/" className="text-xs font-black tracking-[0.35em] uppercase text-white hover:text-zinc-400 transition-colors duration-300 flex items-center">
          <span>PARALLA</span>
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center -ml-[0.2em] mr-[0.4em]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[1.6em] h-[1.6em]">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </motion.span>
          <span>FRAMES</span>
        </Link>

        {/* Center: built by */}
        <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-700">
          Built by{' '}
          <a href="https://aviterx.com" target="_blank" rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white transition-colors duration-300">
            Aviterx
          </a>
          {' '}· © {year}
        </p>

        {/* Right: socials */}
        <div className="flex items-center gap-5">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-zinc-600 hover:text-white transition-colors duration-300"
            >
              {s.icon}
            </a>
          ))}
        </div>

      </div>
    </motion.footer>
  )
}
