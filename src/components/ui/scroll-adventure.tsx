'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export interface AdventurePage {
  id: string;
  title: string;
  subtitle?: string;
  body?: string;
  image?: string;
  accent?: string;
}

interface ScrollAdventureProps {
  pages: AdventurePage[];
  className?: string;
}

/**
 * Script #4 — ScrollAdventure
 * Hijacks the wheel inside its viewport-sized container and reveals pages one by one.
 * When the user has seen all pages, normal page scroll resumes.
 */
const ScrollAdventure: React.FC<ScrollAdventureProps> = ({ pages, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const lockRef = useRef(false);
  const indexRef = useRef(0);
  indexRef.current = index;

  const tryAdvance = useCallback(
    (dir: 1 | -1) => {
      if (lockRef.current) return false;
      const next = indexRef.current + dir;
      if (next < 0 || next >= pages.length) return false;
      lockRef.current = true;
      setIndex(next);
      window.setTimeout(() => {
        lockRef.current = false;
      }, 850);
      return true;
    },
    [pages.length],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isInside = () => {
      const r = el.getBoundingClientRect();
      return r.top <= 1 && r.bottom >= window.innerHeight - 1;
    };

    const onWheel = (e: WheelEvent) => {
      if (!isInside()) return;
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      const atEdge =
        (dir === 1 && indexRef.current === pages.length - 1) ||
        (dir === -1 && indexRef.current === 0);
      if (atEdge) return; // let page scroll
      e.preventDefault();
      tryAdvance(dir);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isInside()) return;
      const dy = touchStartY - e.touches[0].clientY;
      if (Math.abs(dy) < 30) return;
      const dir: 1 | -1 = dy > 0 ? 1 : -1;
      const atEdge =
        (dir === 1 && indexRef.current === pages.length - 1) ||
        (dir === -1 && indexRef.current === 0);
      if (atEdge) return;
      e.preventDefault();
      if (tryAdvance(dir)) touchStartY = e.touches[0].clientY;
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [tryAdvance, pages.length]);

  const page = pages[index];

  return (
    <section
      ref={ref}
      className={`relative w-full h-screen overflow-hidden bg-[#0a0a0a] ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={page.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          className="absolute inset-0"
        >
          {page.image && (
            <div className="absolute inset-0">
              <img
                src={page.image}
                alt=""
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
            </div>
          )}
          <div className="relative z-10 h-full flex flex-col justify-center items-start px-8 md:px-20 max-w-5xl">
            {page.subtitle && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-xs tracking-[0.3em] uppercase mb-4"
                style={{ color: page.accent || '#f5a524' }}
              >
                {page.subtitle}
              </motion.span>
            )}
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl text-zinc-100 leading-[1.05] mb-6"
            >
              {page.title}
            </motion.h2>
            {page.body && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="text-zinc-400 text-lg md:text-xl max-w-2xl"
              >
                {page.body}
              </motion.p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
        {pages.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            className="group flex items-center gap-3"
            aria-label={`Page ${i + 1}`}
          >
            <span className="text-[10px] tabular-nums text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
              0{i + 1}
            </span>
            <span
              className={`block h-px transition-all duration-500 ${
                i === index ? 'w-10 bg-zinc-100' : 'w-5 bg-zinc-600'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-[10px] tracking-[0.3em] uppercase text-zinc-500">
        {index < pages.length - 1 ? 'Scroll · Continuer' : 'Scroll · Sortir'}
      </div>
    </section>
  );
};

export default ScrollAdventure;
