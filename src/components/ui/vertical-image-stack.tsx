"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

export type StackImage = {
  id: string | number;
  src: string;
  alt: string;
  title?: string;
  category?: string;
  year?: string | number;
};

interface VerticalImageStackProps {
  images: StackImage[];
  className?: string;
}

export function VerticalImageStack({ images, className = "" }: VerticalImageStackProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tall outer wrapper drives scroll-pinned card flipping.
  // Each image gets ~80vh of scroll distance; sticky inner holds the stack at center.
  const sectionHeight = `${Math.max(images.length, 1) * 80 + 40}vh`;

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress (0..1) to image index, with some padding at start/end
  const indexMV = useTransform(scrollYProgress, (p) => {
    const n = images.length;
    if (n === 0) return 0;
    // leave 5% lead-in and 5% lead-out
    const adj = Math.min(1, Math.max(0, (p - 0.05) / 0.9));
    return Math.min(n - 1, Math.floor(adj * n));
  });

  useMotionValueEvent(indexMV, "change", (v) => {
    const i = Math.round(v as number);
    setCurrentIndex((prev) => (prev === i ? prev : i));
  });

  const scrollToIndex = (i: number) => {
    const el = wrapperRef.current;
    if (!el) return;
    const n = images.length;
    const rect = el.getBoundingClientRect();
    const total = el.offsetHeight - window.innerHeight;
    // target progress for index i = 0.05 + (i + 0.5) / n * 0.9
    const targetP = 0.05 + ((i + 0.5) / n) * 0.9;
    const targetScroll = window.scrollY + rect.top + targetP * total;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    if (diff === 0) return { y: 0, z: 0, scale: 1, opacity: 1, zIndex: 50, rotateX: 0 };
    if (diff === -1) return { y: -140, z: -120, scale: 0.84, opacity: 0.55, zIndex: 40, rotateX: 10 };
    if (diff === -2) return { y: -240, z: -240, scale: 0.7, opacity: 0.25, zIndex: 30, rotateX: 18 };
    if (diff === 1) return { y: 140, z: -120, scale: 0.84, opacity: 0.55, zIndex: 40, rotateX: -10 };
    if (diff === 2) return { y: 240, z: -240, scale: 0.7, opacity: 0.25, zIndex: 30, rotateX: -18 };
    return { y: diff > 0 ? 360 : -360, z: -360, scale: 0.6, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -22 : 22 };
  };

  const isVisible = (index: number) => Math.abs(index - currentIndex) <= 2;

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`} style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden select-none" style={{ perspective: "1200px" }}>
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[60%] h-[60%] rounded-full bg-brand-orange/10 blur-[120px]" />
        </div>

        {/* Card stack */}
        <div
          className="relative w-[78%] max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] aspect-[4/5]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {images.map((image, index) => {
            if (!isVisible(index)) return null;
            const style = getCardStyle(index);

            return (
              <motion.div
                key={image.id}
                animate={style}
                transition={{ type: "spring", stiffness: 220, damping: 30, mass: 0.9 }}
                className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                {(image.title || image.category) && (
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between gap-3 text-white">
                    <div className="min-w-0">
                      {image.category && (
                        <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/60 mb-1.5 truncate">
                          {image.category}
                        </div>
                      )}
                      {image.title && (
                        <div className="text-lg sm:text-xl font-black uppercase tracking-tight leading-none truncate">
                          {image.title}
                        </div>
                      )}
                    </div>
                    {image.year && (
                      <div className="text-[10px] font-mono text-white/70 shrink-0">{image.year}</div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Navigation dots */}
        <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "h-6 bg-white" : "h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-baseline gap-1 text-white font-mono z-10">
          <span className="text-2xl sm:text-3xl font-black tabular-nums">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-xs text-white/40">/ {String(images.length).padStart(2, "0")}</span>
        </div>

        {/* Instruction hint */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-white/50 z-10">
          <ChevronUp size={12} />
          <span>Scroll</span>
          <ChevronDown size={12} />
        </div>

        {/* Up/down buttons */}
        <button
          onClick={() => scrollToIndex(Math.max(0, currentIndex - 1))}
          aria-label="Previous"
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-8 w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-center z-10"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={() => scrollToIndex(Math.min(images.length - 1, currentIndex + 1))}
          aria-label="Next"
          className="absolute left-4 sm:left-6 top-1/2 translate-y-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-center z-10"
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}
