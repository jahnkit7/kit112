import * as React from "react";
import { motion, type PanInfo } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "@/components/icons/hugeicons";
import { cn } from "@/lib/utils";

export type FocusRailItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  gradient?: string;
  href?: string;
  meta?: string;
};

interface FocusRailProps {
  items: FocusRailItem[];
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
  compact?: boolean;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const BASE_SPRING = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
} as const;

const TAP_SPRING = {
  type: "spring",
  stiffness: 450,
  damping: 18,
  mass: 1,
} as const;

export function FocusRail({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  interval = 4000,
  className,
  compact = false,
}: FocusRailProps) {
  const [active, setActive] = React.useState(initialIndex);
  const [isHovering, setIsHovering] = React.useState(false);
  const lastWheelTime = React.useRef(0);

  const count = items.length;
  const activeIndex = wrap(0, count, active);
  const activeItem = items[activeIndex];

  const handlePrev = React.useCallback(() => {
    if (!loop && active === 0) return;
    setActive((p) => p - 1);
  }, [loop, active]);

  const handleNext = React.useCallback(() => {
    if (!loop && active === count - 1) return;
    setActive((p) => p + 1);
  }, [loop, active, count]);

  const onWheel = React.useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;

      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;

      if (Math.abs(delta) > 20) {
        e.preventDefault();
        delta > 0 ? handleNext() : handlePrev();
        lastWheelTime.current = now;
      }
    },
    [handleNext, handlePrev],
  );

  React.useEffect(() => {
    if (!autoPlay || isHovering) return;
    const timer = window.setInterval(() => handleNext(), interval);
    return () => window.clearInterval(timer);
  }, [autoPlay, isHovering, handleNext, interval]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) handleNext();
    if (swipe > swipeConfidenceThreshold) handlePrev();
  };

  const visibleIndices = compact ? [-1, 0, 1] : [-2, -1, 0, 1, 2];

  if (!count) return null;

  return (
    <div
      className={cn(
        "group relative aspect-square w-full overflow-hidden rounded-[1.35rem] border border-white/10 bg-zinc-950/70 outline-none ring-0",
        "shadow-[0_22px_55px_rgba(0,0,0,0.38)] focus-visible:ring-2 focus-visible:ring-white/30",
        className,
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
      role="region"
      aria-label="Portfolio associé"
    >
      <motion.div
        className="absolute inset-0 opacity-60"
        animate={{ background: activeItem.gradient }}
        transition={{ duration: 0.45 }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.16),transparent_34%),linear-gradient(to_top,rgba(0,0,0,0.72),rgba(0,0,0,0.08)_55%,rgba(0,0,0,0.32))]" />

      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={onDragEnd}
        style={{ perspective: 900, transformStyle: "preserve-3d" }}
      >
        {visibleIndices.map((offset) => {
          const absIndex = active + offset;
          const index = wrap(0, count, absIndex);
          const item = items[index];

          if (!loop && (absIndex < 0 || absIndex >= count)) return null;

          const isCenter = offset === 0;
          const dist = Math.abs(offset);
          const xOffset = offset * (compact ? 118 : 150);
          const zOffset = -dist * 120;
          const scale = isCenter ? 0.86 : 0.68;
          const rotateY = offset * -18;
          const opacity = isCenter ? 1 : Math.max(0.15, 1 - dist * 0.42);
          const blur = isCenter ? 0 : dist * 4;
          const brightness = isCenter ? 1 : 0.48;

          return (
            <motion.button
              type="button"
              key={`${item.id}-${offset}`}
              className="absolute left-1/2 top-1/2 aspect-[4/5] w-[62%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.05rem] border border-white/15 bg-zinc-900 shadow-[0_22px_60px_rgba(0,0,0,0.5)]"
              animate={{
                x: `calc(-50% + ${xOffset}px)`,
                y: "-50%",
                z: zOffset,
                scale,
                rotateY,
                opacity,
                filter: `blur(${blur}px) brightness(${brightness})`,
              }}
              transition={BASE_SPRING}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => {
                if (offset !== 0) setActive((p) => p + offset);
              }}
              aria-label={item.title}
            >
              {item.imageSrc ? (
                <img src={item.imageSrc} alt="" className="h-full w-full object-cover" draggable={false} />
              ) : (
                <div className="h-full w-full" style={{ background: item.gradient }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-white/10" />
              {isCenter && <div className="absolute inset-x-3 bottom-3 h-px bg-white/35" />}
            </motion.button>
          );
        })}
      </motion.div>

      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {activeItem.meta && (
            <div className="mb-1 text-[9px] font-black uppercase tracking-[0.28em] text-white/55">
              {activeItem.meta}
            </div>
          )}
          <div className="truncate text-sm font-black uppercase tracking-normal text-white">
            {activeItem.title}
          </div>
        </div>
        {activeItem.href && (
          <a
            href={activeItem.href}
            className="pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25"
            aria-label="Ouvrir le projet"
          >
            <ArrowUpRight size={16} />
          </a>
        )}
      </div>

      <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white/80 backdrop-blur-sm transition hover:bg-white/15 hover:text-white"
          aria-label="Image précédente"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-bold text-white/65 backdrop-blur-sm">
          {activeIndex + 1} / {count}
        </span>
        <button
          type="button"
          onClick={handleNext}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white/80 backdrop-blur-sm transition hover:bg-white/15 hover:text-white"
          aria-label="Image suivante"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}