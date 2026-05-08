'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const MOSAIC: { col: string; row: string }[] = [
  { col: 'span 2', row: 'span 2' },
  { col: 'span 1', row: 'span 1' },
  { col: 'span 1', row: 'span 1' },
  { col: 'span 1', row: 'span 1' },
  { col: 'span 2', row: 'span 1' },
]

interface Props {
  event: {
    title: string
    location: string
    date: string
    gallery: string[]
  }
}

// Split title into letters for stagger animation
function SplitTitle({ text }: { text: string }) {
  return (
    <span className="inline-flex flex-wrap overflow-hidden">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.1 + i * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00a0' : char}
        </motion.span>
      ))}
    </span>
  )
}

// Each gallery image — respects mobile/desktop layout
function GalleryImage({
  url, index, title, isMobile,
}: { url: string; index: number; title: string; isMobile: boolean }) {
  const { col, row } = MOSAIC[index % MOSAIC.length]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.9,
        delay: isMobile ? 0 : (index % 3) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative overflow-hidden group"
      style={{
        // On mobile: single column, 16:9 aspect ratio per image
        // On desktop: mosaic spans
        gridColumn: isMobile ? 'span 1' : col,
        gridRow:    isMobile ? 'span 1' : row,
        aspectRatio: isMobile ? '16/9' : undefined,
      }}
    >
      <Image
        src={url}
        alt={`${title} photo ${index + 1}`}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes={isMobile ? '100vw' : '(max-width: 768px) 100vw, 33vw'}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
    </motion.div>
  )
}

export default function EventGalleryClient({ event }: Props) {
  const gallery = (event.gallery || []).filter(Boolean)
  const heroRef = useRef<HTMLDivElement>(null)

  // Detect mobile — default to false (desktop) to avoid layout flash
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Parallax: title fades + lifts as you scroll
  const { scrollY } = useScroll()
  const titleY       = useTransform(scrollY, [0, 300], [0, -60])
  const titleOpacity = useTransform(scrollY, [0, 200], [1, 0])

  return (
    <main className="bg-[#050505] text-white min-h-screen">

      {/* ── Hero Header ─────────────────────────────────────── */}
      <div ref={heroRef} className="px-6 md:px-10 pt-28 pb-8">
        <motion.div style={{ y: titleY, opacity: titleOpacity }}>
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-4 select-none">
            <SplitTitle text={event.title} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11px] tracking-[0.4em] uppercase text-zinc-400"
          >
            {event.location} • {event.date}
          </motion.p>
        </motion.div>
      </div>

      {/* ── Gallery ─────────────────────────────────────────── */}
      {gallery.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="px-6 md:px-10 pb-20"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gridAutoRows: isMobile
                ? 'auto'          // driven by aspectRatio on each item
                : 'clamp(140px, 25vh, 280px)',
              gridAutoFlow: isMobile ? 'row' : 'dense',
              gap: 0,
            }}
          >
            {gallery.map((url, i) => (
              <GalleryImage
                key={i}
                url={url}
                index={i}
                title={event.title}
                isMobile={isMobile}
              />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-6 md:px-10 text-zinc-600 italic text-sm"
        >
          No gallery images yet.
        </motion.div>
      )}

    </main>
  )
}
