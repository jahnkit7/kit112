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

  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-[1.35rem] border border-white/5 bg-zinc-950/80 outline-none ring-0",
        "shadow-[0_14px_34px_rgba(0,0,0,0.24)] focus-visible:ring-2 focus-visible:ring-white/30",
        className,
      )}
      tabIndex={0}
      role="region"
      aria-label="Portfolio associé"
    >
      <div className="absolute inset-0 grid grid-cols-2 gap-2 p-2">
        {visibleItems.map((item, i) => (
          <div
            key={item.id}
            className={cn(
              "min-h-0 rounded-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
              i === 0 && "col-span-2",
            )}
            style={{ background: item.gradient }}
            aria-label={item.title}
          />
        ))}
      </div>
    </div>
  );
}