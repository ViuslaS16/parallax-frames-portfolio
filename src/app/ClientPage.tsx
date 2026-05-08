"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), { ssr: false })


/* ── helpers ───────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const

const TICKER_WORDS = [
  'NIGHTLIFE', 'ARCHIVE', 'EDM', 'FESTIVAL',
  'MAINSTAGE', 'UNDERGROUND', 'CHAOS', 'ENERGY',
  'COLOMBO', 'YAGA', 'DANCEFLOOR', 'VISCERAL',
]

function ScanLines() {
  const positions = [12, 24, 36, 50, 62, 74, 86]
  return (
    <>
      {positions.map((top, i) => (
        <div key={i} className="absolute left-0 right-0 pointer-events-none" style={{ top: `${top}%` }}>
          <motion.div
            className="h-px w-full"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 0.8, 0.8, 0] }}
            transition={{
              duration: 3.5,
              delay: i * 0.6 + 0.5,
              repeat: Infinity,
              repeatDelay: 4,
              ease,
            }}
            style={{
              transformOrigin: i % 2 === 0 ? 'left center' : 'right center',
              background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)'
            }}
          />
        </div>
      ))}
    </>
  )
}

function CornerMarks() {
  const corners = [
    { top: '1.5rem', left: '1.5rem' },
    { top: '1.5rem', right: '1.5rem' },
    { bottom: '1.5rem', left: '1.5rem' },
    { bottom: '1.5rem', right: '1.5rem' },
  ]
  return (
    <>
      {corners.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-6 h-6 pointer-events-none"
          style={pos}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 + i * 0.1 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
            {i === 0 && <><path d="M0 12 L0 0 L12 0" /></>}
            {i === 1 && <><path d="M24 12 L24 0 L12 0" /></>}
            {i === 2 && <><path d="M0 12 L0 24 L12 24" /></>}
            {i === 3 && <><path d="M24 12 L24 24 L12 24" /></>}
          </svg>
        </motion.div>
      ))}
    </>
  )
}

function Ticker() {
  const words = [...TICKER_WORDS, ...TICKER_WORDS]
  return (
    <div className="absolute bottom-10 left-0 right-0 overflow-hidden pointer-events-none">
      <div className="flex">
        <motion.div
          className="flex gap-10 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {words.map((w, i) => (
            <span key={i} className="text-[10px] tracking-[0.5em] uppercase text-zinc-800 select-none">
              {w} <span className="text-zinc-900 mx-2">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

type EventData = {
  id: string;
  title: string;
  location: string;
  image: string;
  date: string;
};

type GalleryImage = {
  src: string;
  title: string;
};

export default function ClientPage({ 
  featuredEvents = [], 
  galleryImages = [] 
}: { 
  featuredEvents: EventData[], 
  galleryImages: GalleryImage[] 
}) {
  const containerRef = useRef(null);

  return (
    <main ref={containerRef} className="bg-[#050505] text-white min-h-screen relative selection:bg-white selection:text-black">
      {/* Film Grain Overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")', backgroundRepeat: 'repeat' }} />

      {/* HERO SECTION */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">

        {/* 3D Canvas background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <HeroCanvas />
        </div>

        {/* Radial glow — pulses on top of canvas */}
        <motion.div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, rgba(5,5,5,0.85) 65%)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Horizontal scan lines */}
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <ScanLines />
        </div>

        {/* Corner bracket markers */}
        <div className="absolute inset-0 z-[3] pointer-events-none">
          <CornerMarks />
        </div>


        {/* Central text */}
        <div className="z-10 text-center px-4 w-full">
          {/* PARALLAX — letter reveal with TV flicker */}
          <h1 className="font-black uppercase tracking-tighter leading-none select-none flex flex-col items-center">
            <motion.span 
              className="inline-flex overflow-hidden text-[14vw] sm:text-[12vw] md:text-[10vw]"
              animate={{ opacity: [1, 0.7, 1, 1, 0.4, 1, 1, 0.8, 1, 1, 0.5, 1, 1] }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                times: [0, 0.05, 0.1, 0.3, 0.35, 0.4, 0.6, 0.65, 0.7, 0.9, 0.95, 0.98, 1],
                ease: "linear"
              }}
            >
              {'PARALLAX'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.05, ease }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
            {/* NIGHT LIFE ARCHIVE — delayed, dimmed */}
            <span className="inline-flex overflow-hidden text-[6vw] sm:text-[5vw] md:text-[4vw] mt-2 whitespace-nowrap">
              {'NIGHT LIFE ARCHIVE'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 + i * 0.06, ease }}
                  className="inline-block text-zinc-600"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease }}
            className="text-xs md:text-sm tracking-[0.35em] uppercase text-zinc-500 mt-12 font-light"
          >
            An Interactive Exhibition of Chaos &amp; Energy
          </motion.p>

          {/* Thin horizontal rule that expands */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <motion.div
              className="h-px bg-zinc-800"
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 1, delay: 1.6, ease }}
            />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="text-[9px] tracking-[0.5em] uppercase text-zinc-700"
            >
              Scroll to explore
            </motion.span>
            <motion.div
              className="h-px bg-zinc-800"
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 1, delay: 1.6, ease }}
            />
          </div>
        </div>

        {/* Bottom ticker */}
        <Ticker />

      </section>

      {/* FEATURED EVENTS */}
      <section className="py-8 md:py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="text-xs tracking-[0.4em] uppercase text-zinc-500 mb-8"
          >
            Featured Events
          </motion.h2>

          <div className="flex flex-col gap-12 md:gap-16">
            {featuredEvents.map((event, i) => (
              <FeaturedEventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY ARCHIVE (MASONRY) */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="text-xs tracking-[0.4em] uppercase text-zinc-500 mb-8 md:mb-12"
          >
            Gallery Archive
          </motion.h2>
          
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.1 }}
                className="relative overflow-hidden group cursor-pointer break-inside-avoid"
              >
                <div className="relative w-full aspect-[3/4]">
                  <Image 
                    src={img.src} 
                    alt={`Gallery Image ${i + 1}`} 
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#050505]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <p className="text-white text-xs md:text-sm tracking-[0.3em] uppercase font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {img.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .radial-gradient-glow {
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, rgba(5, 5, 5, 1) 70%);
        }
      `}</style>
    </main>
  );
}

function FeaturedEventCard({ event, index }: { event: any, index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <Link href={`/event/${event.id}`}>
      <motion.div 
        ref={ref}
        className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden group cursor-pointer rounded-sm bg-zinc-900/20 block"
      >
        <motion.div style={{ y }} className="absolute -top-[15%] left-0 w-full h-[130%]">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover brightness-75 group-hover:brightness-100 transition-all duration-1000 ease-out"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent opacity-90 pointer-events-none" />
        
        <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end pointer-events-none">
          <div className="w-full flex flex-col md:flex-row justify-between items-end">
            <div className="overflow-hidden">
              <motion.h3 
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white"
              >
                {event.title}
              </motion.h3>
            </div>
            <div className="text-left md:text-right overflow-hidden mt-4 md:mt-0">
              <motion.p 
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs md:text-sm tracking-[0.3em] uppercase text-zinc-300"
              >
                {event.location} <br/> {event.date}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
