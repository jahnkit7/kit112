import * as React from "react";
import { motion, type PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";

export type FocusRailItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc: string;
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

  const visibleIndices = [-2, -1, 0, 1, 2];

  if (!count) return null;

  return (
    <div
      className={cn(
        "group relative aspect-square w-full overflow-hidden rounded-[1.35rem] bg-zinc-950/80 outline-none ring-0",
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
      <div className="absolute inset-0 bg-zinc-950/85" />

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
          const xOffset = offset * (compact ? 210 : 320);
          const zOffset = -dist * 180;
          const scale = isCenter ? (compact ? 0.92 : 1) : compact ? 0.74 : 0.85;
          const rotateY = offset * -20;
          const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0.5);
          const blur = isCenter ? 0 : dist * 6;
          const brightness = isCenter ? 1 : 0.48;

          return (
            <motion.button
              type="button"
              key={`${item.id}-${offset}`}
              className="absolute left-1/2 top-1/2 aspect-[3/4] w-[68%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.05rem] bg-zinc-900 shadow-[0_22px_60px_rgba(0,0,0,0.5)]"
              animate={{
                x: `calc(-50% + ${xOffset}px)`,
                y: "-50%",
                z: zOffset,
                scale,
                rotateY,
                opacity,
                filter: `blur(${blur}px) brightness(${brightness})`,
              }}
              transition={(valueName) => (valueName === "scale" ? TAP_SPRING : BASE_SPRING)}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => {
                if (offset !== 0) setActive((p) => p + offset);
              }}
              aria-label={item.title}
            >
              <img src={item.imageSrc} alt="" className="h-full w-full object-cover" draggable={false} />
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}