"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, type PanInfo } from "framer-motion";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastNavigationTime = useRef(0);
  const navigationCooldown = 400;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  const navigate = useCallback(
    (newDirection: number) => {
      const now = Date.now();
      if (now - lastNavigationTime.current < navigationCooldown) return;
      lastNavigationTime.current = now;

      setCurrentIndex((prev) => {
        if (newDirection > 0) {
          return prev === images.length - 1 ? 0 : prev + 1;
        }
        return prev === 0 ? images.length - 1 : prev - 1;
      });
    },
    [images.length]
  );

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 50;
    if (info.offset.y < -threshold) navigate(1);
    else if (info.offset.y > threshold) navigate(-1);
  };

  // Only intercept wheel when the component is centered in view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setIsActive(e.intersectionRatio > 0.65));
      },
      { threshold: [0, 0.5, 0.65, 0.85, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const getCardStyle = (index: number) => {
    const total = images.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) return { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 };
    if (diff === -1) return { y: -140, scale: 0.84, opacity: 0.55, zIndex: 4, rotateX: 10 };
    if (diff === -2) return { y: -240, scale: 0.7, opacity: 0.25, zIndex: 3, rotateX: 18 };
    if (diff === 1) return { y: 140, scale: 0.84, opacity: 0.55, zIndex: 4, rotateX: -10 };
    if (diff === 2) return { y: 240, scale: 0.7, opacity: 0.25, zIndex: 3, rotateX: -18 };
    return { y: diff > 0 ? 360 : -360, scale: 0.6, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -22 : 22 };
  };

  const isVisible = (index: number) => {
    const total = images.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.abs(diff) <= 2;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[80vh] min-h-[520px] flex items-center justify-center overflow-hidden select-none ${className}`}
      style={{ perspective: "1200px" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[60%] h-[60%] rounded-full bg-brand-orange/10 blur-[120px]" />
      </div>

      {/* Card stack */}
      <div className="relative w-[78%] max-w-[360px] sm:max-w-[420px] aspect-[4/5]" style={{ transformStyle: "preserve-3d" }}>
        {images.map((image, index) => {
          if (!isVisible(index)) return null;
          const style = getCardStyle(index);
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={image.id}
              drag={isCurrent ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.18}
              onDragEnd={handleDragEnd}
              animate={style}
              transition={{ type: "spring", stiffness: 220, damping: 28, mass: 0.9 }}
              className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] cursor-grab active:cursor-grabbing"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src={image.src}
                alt={image.alt}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              {/* Inner glow */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
              {/* Bottom gradient */}
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
                    <div className="text-[10px] font-mono text-white/70 shrink-0">
                      {image.year}
                    </div>
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
            onClick={() => {
              if (index !== currentIndex) setCurrentIndex(index);
            }}
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
        <span>Scroll / drag</span>
        <ChevronDown size={12} />
      </div>

      {/* Up/down buttons for accessibility */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Previous"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-8 w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-center z-10"
      >
        <ChevronUp size={16} />
      </button>
      <button
        onClick={() => navigate(1)}
        aria-label="Next"
        className="absolute left-4 sm:left-6 top-1/2 translate-y-0 w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-center z-10"
      >
        <ChevronDown size={16} />
      </button>

    </div>
  );
}