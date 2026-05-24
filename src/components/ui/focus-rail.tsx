import * as React from "react";
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

export function FocusRail({
  items,
  initialIndex = 0,
  className,
}: FocusRailProps) {
  const count = items.length;

  if (!count) return null;

  const visibleItems = items.slice(initialIndex, initialIndex + 5);

  const [hero, ...rest] = visibleItems;
  const thumbs = rest.slice(0, 3);

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-[1.35rem] outline-none ring-0",
        "focus-visible:ring-2 focus-visible:ring-white/30",
        className,
      )}
      tabIndex={0}
      role="region"
      aria-label="Portfolio associé"
    >
      {/* Hero image — large, slightly rotated stacked card */}
      {hero && (
        <div
          className="absolute inset-x-2 top-2 bottom-[42%] overflow-hidden rounded-2xl border border-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          style={{ background: hero.gradient }}
        >
          <img
            src={hero.imageSrc}
            alt={hero.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover opacity-95"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute left-3 bottom-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/90 drop-shadow">
            {hero.title}
          </span>
        </div>
      )}

      {/* Offset thumbnails — overlapping innovative strip */}
      <div className="absolute inset-x-2 bottom-2 top-[60%] flex items-end gap-2">
        {thumbs.map((item, i) => (
          <div
            key={item.id}
            className={cn(
              "relative flex-1 overflow-hidden rounded-xl border border-white/10 shadow-[0_8px_18px_rgba(0,0,0,0.4)]",
              i === 0 && "h-[88%] -rotate-2",
              i === 1 && "h-full rotate-1",
              i === 2 && "h-[82%] -rotate-1",
            )}
            style={{ background: item.gradient }}
            aria-label={item.title}
          >
            <img
              src={item.imageSrc}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover opacity-95"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}