'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

/* ─── animation helpers ─────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as const

function SplitTitle({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 + i * 0.04, ease }}
          className="inline-block"
        >
          {char === ' ' ? '\u00a0' : char}
        </motion.span>
      ))}
    </>
  )
}

function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── data ──────────────────────────────────────────────── */
const SERVICES = [
  { name: 'Festival Coverage',  desc: 'Full multi-day events' },
  { name: 'Artist Touring',     desc: 'On the road documentation' },
  { name: 'Club Residencies',   desc: 'Ongoing night coverage' },
  { name: 'Editorial / Press',  desc: 'Publication-ready sets' },
  { name: 'Brand Campaigns',    desc: 'Commercial collaborations' },
]

export const SOCIALS = [
  {
    label: 'Instagram',
    handle: '@raviya_z',
    href: 'https://www.instagram.com/raviya_z?igsh=eGE0ZHZscTlrbzJy',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    handle: '@raviya_z7',
    href: 'https://www.tiktok.com/@raviya_z7?_r=1&_t=ZS-96BUTcMxaIW',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    handle: 'Raviya Z',
    href: 'https://www.facebook.com/share/1ApTHzDdyC/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
]

const GEAR = [
  { label: 'Primary',    items: ['Sony a7S III', '24–70mm f/2.8 GM', '35mm f/1.4 GM'] },
  { label: 'Secondary',  items: ['Leica Q2 Monochrom'] },
  { label: 'Lighting',   items: ['Profoto A10', '1/8 CTO Gels'] },
]

const CITIES = [
  // Sri Lanka
  'Colombo', 'Gampaha', 'Kandy', 'Galle', 'Negombo',
  'Matara', 'Jaffna', 'Trincomalee', 'Batticaloa',
  // International
  'Dubai', 'Singapore', 'London', 'Melbourne',
  'Bangkok', 'Mumbai', 'Amsterdam', 'Berlin', 'Bali',
]

/* ─── Booking form with WhatsApp submit ─────────────────── */
const WHATSAPP_NUMBER = '94741753419'

function BookingSection() {
  const [form, setForm] = useState({
    name: '',
    event: '',
    date: '',
    city: '',
    email: '',
    message: '',
  })
  const [sent, setSent] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text =
      `1. Client name: ${form.name}\n` +
      `2. Event: ${form.event}\n` +
      `3. Date: ${form.date}${form.city ? ' · ' + form.city : ''}\n` +
      `4. Client Email: ${form.email}\n` +
      `5. Message: ${form.message}`

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const fieldBase =
    'w-full bg-transparent border-b border-zinc-800 pb-3 text-sm text-white focus:outline-none focus:border-white transition-colors duration-300'

  return (
    <section className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">

        {/* Left: copy */}
        <FadeUp className="md:col-span-4">
          <p className="text-xs tracking-[0.4em] uppercase text-zinc-500 mb-8">Book</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
            Let&apos;s work<br />together.
          </h2>
          <p className="mt-6 text-sm text-zinc-500 leading-relaxed">
            Currently accepting bookings from{' '}
            <span className="text-white">Q3 2026</span> onwards.
            Fill out the form and a WhatsApp message will open to{' '}
            <span className="text-white">Parallax Frames Mobile</span>.
          </p>
        </FadeUp>

        {/* Right: form */}
        <FadeUp delay={0.15} className="md:col-span-6 md:col-start-7">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Name */}
            <div className="relative group">
              <label className="block text-[10px] tracking-[0.35em] uppercase text-zinc-600 mb-3">Your Name</label>
              <input
                name="name" type="text" required
                placeholder="Full name"
                value={form.name} onChange={handleChange}
                className={`${fieldBase} placeholder:text-zinc-700`}
              />
              <div className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-500 group-focus-within:w-full" />
            </div>

            {/* Event */}
            <div className="relative group">
              <label className="block text-[10px] tracking-[0.35em] uppercase text-zinc-600 mb-3">Event / Organisation</label>
              <input
                name="event" type="text" required
                placeholder="Festival, label, brand…"
                value={form.event} onChange={handleChange}
                className={`${fieldBase} placeholder:text-zinc-700`}
              />
              <div className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-500 group-focus-within:w-full" />
            </div>

            {/* Date + City side by side */}
            <div className="grid grid-cols-2 gap-6">
              {/* Date picker */}
              <div className="relative group">
                <label className="block text-[10px] tracking-[0.35em] uppercase text-zinc-600 mb-3">Event Date</label>
                <input
                  name="date" type="date" required
                  value={form.date} onChange={handleChange}
                  className={`${fieldBase} placeholder:text-zinc-700`}
                  style={{ colorScheme: 'dark' }}
                />
                <div className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-500 group-focus-within:w-full" />
              </div>

              {/* City dropdown */}
              <div className="relative group">
                <label className="block text-[10px] tracking-[0.35em] uppercase text-zinc-600 mb-3">City</label>
                <select
                  name="city" required
                  value={form.city} onChange={handleChange}
                  className={`${fieldBase} appearance-none cursor-pointer`}
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" disabled className="bg-zinc-900">Select city…</option>
                  <optgroup label="Sri Lanka" className="bg-zinc-900 text-zinc-400">
                    {CITIES.slice(0, 9).map(c => (
                      <option key={c} value={c} className="bg-zinc-900">{c}</option>
                    ))}
                  </optgroup>
                  <optgroup label="International" className="bg-zinc-900 text-zinc-400">
                    {CITIES.slice(9).map(c => (
                      <option key={c} value={c} className="bg-zinc-900">{c}</option>
                    ))}
                  </optgroup>
                </select>
                {/* Custom dropdown chevron */}
                <svg className="absolute right-0 bottom-4 w-3 h-3 text-zinc-600 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
                <div className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-500 group-focus-within:w-full" />
              </div>
            </div>

            {/* Email */}
            <div className="relative group">
              <label className="block text-[10px] tracking-[0.35em] uppercase text-zinc-600 mb-3">Email</label>
              <input
                name="email" type="email" required
                placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                className={`${fieldBase} placeholder:text-zinc-700`}
              />
              <div className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-500 group-focus-within:w-full" />
            </div>

            {/* Message */}
            <div className="relative group">
              <label className="block text-[10px] tracking-[0.35em] uppercase text-zinc-600 mb-3">Message</label>
              <textarea
                name="message" rows={4} required
                placeholder="Tell me about the project…"
                value={form.message} onChange={handleChange}
                className={`${fieldBase} placeholder:text-zinc-700 resize-none`}
              />
              <div className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-500 group-focus-within:w-full" />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] font-bold bg-white text-black px-10 py-4 hover:bg-zinc-200 transition-colors duration-300 w-full md:w-auto justify-center"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {sent ? 'WhatsApp Opening…' : 'Send via WhatsApp'}
            </motion.button>

          </form>
        </FadeUp>
      </div>
    </section>
  )
}

/* ─── page ──────────────────────────────────────────────── */
export default function Backstage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroY       = useTransform(scrollY, [0, 400], [0, -80])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <main className="bg-[#050505] text-white min-h-screen selection:bg-white selection:text-black overflow-x-hidden">

      {/* Film Grain */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")', backgroundRepeat: 'repeat' }}
      />

      {/* ── Hero ────────────────────────────────────────────── */}
      <section ref={heroRef} className="min-h-screen flex flex-col justify-end relative overflow-hidden pb-16 px-6 md:px-12">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.04) 0%, rgba(5,5,5,1) 70%)' }} />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="text-[10px] tracking-[0.5em] uppercase text-zinc-600 mb-6"
          >
            Parallax Frames · Photography
          </motion.p>
          <h1 className="text-[16vw] md:text-[14vw] font-black uppercase tracking-tighter leading-none overflow-hidden select-none">
            <SplitTitle text="Backstage" />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease }}
            className="mt-6 text-xs tracking-[0.35em] uppercase text-zinc-500"
          >
            Bookings · Inquiries · Collaborations
          </motion.p>
        </motion.div>
      </section>

      {/* ── About ───────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <FadeUp className="md:col-span-3">
            <p className="text-xs tracking-[0.4em] uppercase text-zinc-500">About</p>
          </FadeUp>
          <FadeUp delay={0.1} className="md:col-span-7">
            <p className="text-2xl md:text-3xl font-light leading-relaxed text-zinc-200">
              Documenting the raw energy of electronic music — from underground
              clubs to festival main stages. Based in Sri Lanka, available worldwide.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-zinc-500">
              The work focuses on visceral, unguarded moments: the crowd mid-drop,
              the artist in flow, the light that exists for a split second.
              Every frame is a record of something that cannot be staged.
            </p>
          </FadeUp>
        </div>
      </section>

      <div className="mx-6 md:mx-12 border-t border-zinc-900" />

      {/* ── Services ────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="text-xs tracking-[0.4em] uppercase text-zinc-500 mb-10">Services</p>
          </FadeUp>
          <ul>
            {SERVICES.map((s, i) => (
              <motion.li
                key={s.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.06, ease }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center py-5 border-b border-zinc-900 group cursor-default"
              >
                <span className="text-base md:text-lg uppercase tracking-widest font-medium text-zinc-300 group-hover:text-white transition-colors duration-300">
                  {s.name}
                </span>
                <span className="text-xs tracking-[0.25em] uppercase text-zinc-600 mt-1 md:mt-0">
                  {s.desc}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-6 md:mx-12 border-t border-zinc-900" />

      {/* ── Socials ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <FadeUp className="md:col-span-3">
            <p className="text-xs tracking-[0.4em] uppercase text-zinc-500">Follow</p>
          </FadeUp>
          <div className="md:col-span-9">
            <ul>
              {SOCIALS.map((s, i) => (
                <motion.li key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                >
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-5 border-b border-zinc-900 group"
                  >
                    <div className="flex items-center gap-5">
                      <span className="text-zinc-600 group-hover:text-white transition-colors duration-300">
                        {s.icon}
                      </span>
                      <div>
                        <p className="text-base uppercase tracking-widest font-medium text-zinc-300 group-hover:text-white transition-colors duration-300">
                          {s.label}
                        </p>
                        <p className="text-xs tracking-wider text-zinc-600 mt-0.5">{s.handle}</p>
                      </div>
                    </div>
                    <span className="text-xs tracking-[0.3em] uppercase text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                      ↗
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="mx-6 md:mx-12 border-t border-zinc-900" />

      {/* ── Booking ─────────────────────────────────────────── */}
      <BookingSection />

      <div className="mx-6 md:mx-12 border-t border-zinc-900" />

      {/* ── Gear ────────────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="text-xs tracking-[0.4em] uppercase text-zinc-500 mb-10">Equipment</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {GEAR.map((cat, i) => (
              <FadeUp key={cat.label} delay={i * 0.08}>
                <p className="text-[10px] tracking-[0.35em] uppercase text-zinc-700 mb-4">{cat.label}</p>
                <ul className="space-y-2">
                  {cat.items.map((g) => <li key={g} className="text-sm text-zinc-400">{g}</li>)}
                </ul>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <div className="h-24" />
    </main>
  )
}
