import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowRight, CheckCircle2, Clock, Presentation, Zap } from 'lucide-react';

/**
 * CinematicHero
 * Full-bleed, film-style landing hero for SmartSpace.
 * Style reference: MotionSites "space / property" hero family — full-frame moving
 * imagery, liquid-glass UI, lower-third headline, slow orchestrated reveal.
 *
 * Background: crossfading Ken-Burns slideshow of your real venue previews.
 * Want true video? Pass `videoSrc` (an .mp4/.webm in /public) and it replaces the slideshow.
 */

export interface HeroVenue {
  id: string;
  name: string;
  category: string;
  institution: string;
  capacity: number;
  equipment: string;
  nextSlot: string;
  imageUrl: string;
}

type SlotId = 'morning' | 'afternoon' | 'evening';

interface CinematicHeroProps {
  venues: HeroVenue[];
  index: number;
  onIndexChange: (i: number) => void;
  onExplore: () => void;
  onRequestDemo: () => void;
  onOpenDeck: () => void;
  onCheckSchedule: () => void;
  simulatorSlot: SlotId;
  isCheckingSlot: boolean;
  onSelectSlot: (slot: SlotId) => void;
  videoSrc?: string;
}

const SLIDE_MS = 6500;
const EASE = [0.16, 1, 0.3, 1] as const;

const SLOTS: { id: SlotId; label: string }[] = [
  { id: 'morning', label: '8 AM – 12 PM' },
  { id: 'afternoon', label: '1 PM – 5 PM' },
  { id: 'evening', label: '6 PM – 9 PM' },
];

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const glass =
  'bg-white/[0.07] backdrop-blur-2xl border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_24px_70px_rgba(2,8,23,0.5)]';

const hd = (url: string) => url.replace('w=1200', 'w=2000');

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  venues,
  index,
  onIndexChange,
  onExplore,
  onRequestDemo,
  onOpenDeck,
  onCheckSchedule,
  simulatorSlot,
  isCheckingSlot,
  onSelectSlot,
  videoSrc,
}) => {
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const venue = venues[index];

  // Warm the cache so crossfades never flash empty
  useEffect(() => {
    venues.forEach((v) => {
      const img = new Image();
      img.src = hd(v.imageUrl);
    });
  }, [venues]);

  // Auto-advance (off for reduced motion, paused on hover/focus)
  useEffect(() => {
    if (paused || reduce) return;
    const t = setTimeout(() => onIndexChange((index + 1) % venues.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, paused, reduce, venues.length, onIndexChange]);

  const reveal = (delay: number) => ({
    initial: reduce ? false : { y: '110%' },
    animate: { y: 0 },
    transition: { duration: 1.1, delay, ease: EASE },
  });

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section
      aria-label="SmartSpace hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative isolate overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-[#0B1528] text-white min-h-[max(680px,calc(100svh-8rem))] flex flex-col border border-slate-800 shadow-2xl"
    >
      {/* ───────── Cinematic background ───────── */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {videoSrc ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoSrc}
            poster={hd(venues[0].imageUrl)}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <AnimatePresence initial={false}>
            <motion.img
              key={venue.id}
              src={hd(venue.imageUrl)}
              alt=""
              className="absolute inset-0 w-full h-full object-cover will-change-transform"
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.14 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 1.4, ease: 'easeInOut' },
                scale: { duration: (SLIDE_MS + 1800) / 1000, ease: 'linear' },
              }}
            />
          </AnimatePresence>
        )}

        {/* Grade: deep navy wash, brand-blue top light, brand-amber floor glow */}
        <div className="absolute inset-0 bg-[#0B1528]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-[#0B1528]/55 to-[#0B1528]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1528]/85 via-[#0B1528]/25 to-transparent" />
        <div className="absolute -top-32 right-0 w-[40rem] h-[40rem] rounded-full bg-[#0077C8]/25 blur-[120px]" />
        <div className="absolute -bottom-40 -left-24 w-[34rem] h-[34rem] rounded-full bg-[#FDB813]/15 blur-[130px]" />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(2,8,23,0.6) 100%)' }}
        />
        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: GRAIN }}
        />
      </div>

      {/* ───────── Top row ───────── */}
      <div className="relative z-10 flex items-start justify-between gap-3 p-5 sm:p-8">
        <motion.div
          {...fade(0.1)}
          className={`inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs ${glass}`}
        >
          <span className="w-2 h-2 rounded-full bg-[#8CC63F] animate-pulse" />
          <span className="font-semibold tracking-wide text-white">Book it, track it, use it.</span>
        </motion.div>

        <motion.div
          {...fade(0.2)}
          className={`hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-slate-200 ${glass}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F] animate-pulse" />
          Conflict engine live · 0 overlaps
        </motion.div>
      </div>

      {/* ───────── Lower third ───────── */}
      <div className="relative z-10 mt-auto px-5 sm:px-8 lg:px-12 pb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
        {/* Headline block */}
        <div className="max-w-3xl">
          <h1 className="font-semibold tracking-[-0.035em] leading-[0.98] text-[2.75rem] sm:text-7xl lg:text-[5.5rem]">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span className="block" {...reveal(0.25)}>
                Every campus space.
              </motion.span>
            </span>
            <span
              className="block overflow-hidden pb-[0.12em] italic font-normal text-white/95"
              style={{ fontFamily: "'Instrument Serif', Georgia, 'Times New Roman', serif" }}
            >
              <motion.span className="block" {...reveal(0.4)}>
                One smarter way to book.
              </motion.span>
            </span>
          </h1>

          <motion.p
            {...fade(0.85)}
            className="mt-6 max-w-xl text-base sm:text-lg text-slate-200/90 leading-relaxed"
          >
            Discover, reserve, and manage university facilities across participating campuses through one
            intelligent booking platform.
          </motion.p>

          <motion.div {...fade(1.0)} className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExplore}
              className="group px-7 py-3.5 rounded-full bg-[#0077C8] hover:bg-[#0a89e0] text-white font-bold text-sm shadow-[0_10px_40px_rgba(0,119,200,0.45)] transition-all flex items-center gap-2.5 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1528]"
            >
              <span>Explore facilities</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>
            <button
              type="button"
              onClick={onRequestDemo}
              className={`px-7 py-3.5 rounded-full text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer hover:bg-white/15 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${glass}`}
            >
              <span>Request demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenDeck}
              className="px-4 py-3.5 rounded-full text-slate-300 hover:text-white font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Presentation className="w-4 h-4 text-[#FDB813]" />
              <span>Executive deck</span>
            </button>
          </motion.div>
        </div>

        {/* Live venue card */}
        <motion.aside
          {...fade(1.15)}
          aria-label="Live venue preview"
          className={`w-full lg:w-[22.5rem] shrink-0 rounded-3xl p-5 ${glass}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={venue.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4"
            >
              <div>
                <p className="text-xs font-semibold text-[#FDB813]">{venue.institution}</p>
                <h3 className="mt-1 text-lg font-bold leading-snug">{venue.name}</h3>
                <p className="mt-0.5 text-xs text-slate-300">{venue.category}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-black/25 border border-white/10 p-3">
                  <span className="block text-[11px] text-slate-400">Capacity</span>
                  <strong className="text-sm">{venue.capacity} people</strong>
                </div>
                <div className="rounded-xl bg-black/25 border border-white/10 p-3">
                  <span className="block text-[11px] text-slate-400">Next open slot</span>
                  <strong className="text-sm text-[#8CC63F]">{venue.nextSlot}</strong>
                </div>
              </div>

              <p className="hidden sm:block text-xs text-slate-300 leading-relaxed">{venue.equipment}</p>
            </motion.div>
          </AnimatePresence>

          {/* Slot-lock simulator (kept from the original hero) */}
          <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
              <Zap className="w-3 h-3 text-[#FDB813]" />
              Try a slot — we check every campus schedule
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {SLOTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectSlot(s.id)}
                  aria-pressed={simulatorSlot === s.id}
                  className={`py-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    simulatorSlot === s.id
                      ? 'bg-[#0077C8]/35 border-sky-300/60 text-white shadow-[0_0_18px_rgba(0,119,200,0.35)]'
                      : 'bg-black/20 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="h-4 text-[11px]" aria-live="polite">
              {isCheckingSlot ? (
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Clock className="w-3 h-3 animate-spin" />
                  Checking schedules…
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  No conflicts — this slot is free
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onCheckSchedule}
              className="w-full py-2.5 rounded-xl bg-white text-[#0B1528] text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1528]"
            >
              See this venue's full schedule
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.aside>
      </div>

      {/* ───────── Venue timeline / selector ───────── */}
      <motion.nav
        {...fade(1.3)}
        aria-label="Choose venue preview"
        className="relative z-10 px-5 sm:px-8 lg:px-12 pb-6 sm:pb-8"
      >
        <ol className="grid gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${venues.length}, minmax(0, 1fr))` }}>
          {venues.map((v, i) => {
            const active = i === index;
            return (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => onIndexChange(i)}
                  aria-label={`Preview ${v.name}`}
                  aria-current={active}
                  className="group w-full text-left cursor-pointer py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                >
                  <span
                    className={`hidden md:block mb-2 truncate text-[11px] font-semibold transition-colors ${
                      active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {v.category}
                  </span>
                  <span className="relative block h-[3px] rounded-full bg-white/20 overflow-hidden">
                    {active && (
                      <motion.span
                        key={`${index}-${paused}`}
                        className="absolute inset-0 origin-left bg-white"
                        initial={{ scaleX: reduce || paused ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: reduce || paused ? 0 : SLIDE_MS / 1000, ease: 'linear' }}
                      />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </motion.nav>
    </section>
  );
};

export default CinematicHero;
