"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  cubicBezier,
} from "framer-motion";
import { useMemo, useRef } from "react";

const easeIntoFocus = cubicBezier(0.22, 1, 0.36, 1);
const easeOutOfFocus = cubicBezier(0, 0, 0.58, 1);
const focusEase: [typeof easeIntoFocus, typeof easeOutOfFocus] = [
  easeIntoFocus,
  easeOutOfFocus,
];

type Side = "L" | "R";

type TileConfig = {
  aspectRatio: string;
  perspective: number;
  maxTilt: number;
  maxBlur: number;
  rounded: string;
};

function Tile({ src, side, config }: { src: string; side: Side; config: TileConfig }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const reduce = useReducedMotion();
  const sign = side === "L" ? -1 : 1;
  const { aspectRatio, perspective, maxTilt, maxBlur, rounded } = config;

  const blur = useTransform(p, [0, 0.5, 1], [maxBlur, 0, maxBlur], { ease: focusEase });
  const bright = useTransform(p, [0, 0.5, 1], [0, 1, 0], { ease: focusEase });
  const contrast = useTransform(p, [0, 0.5, 1], [4, 1, 4], { ease: focusEase });

  const ty = useTransform(p, [0, 0.5, 1], ["100%", "0%", "-100%"], { ease: focusEase });
  const tz = useTransform(p, [0, 0.5, 1], [300, 0, 300], { ease: focusEase });
  const rx = useTransform(p, [0, 0.5, 1], [maxTilt, 0, -maxTilt], { ease: focusEase });

  const tx = useTransform(p, [0, 0.5, 1], [`${sign * 40}%`, "0%", `${sign * 40}%`], { ease: focusEase });
  const rot = useTransform(p, [0, 0.5, 1], [-sign * 5, 0, sign * 5], { ease: focusEase });
  const sk = useTransform(p, [0, 0.5, 1], [sign * 20, 0, -sign * 20], { ease: focusEase });

  const innerSY = useTransform(p, [0, 0.5, 1], [1.8, 1, 1.8], { ease: focusEase });

  const filter = useMotionTemplate`blur(${blur}px) brightness(${bright}) contrast(${contrast})`;

  if (reduce) {
    return (
      <div ref={ref} style={{ aspectRatio }} className="overflow-hidden" >
        <div style={{ borderRadius: rounded }} className="w-full h-full overflow-hidden">
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ aspectRatio, perspective: `${perspective}px` }}>
      <motion.div style={{ y: ty, z: tz, rotateX: rx, transformStyle: "preserve-3d" }} className="w-full h-full">
        <motion.div
          style={{ x: tx, rotate: rot, skewX: sk, borderRadius: rounded, filter }}
          className="w-full h-full overflow-hidden"
        >
          <motion.img
            src={src}
            alt=""
            style={{ scaleY: innerSY }}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export type ScrollTiltedGridProps = {
  images: readonly string[];
  aspectRatio?: string;
  perspective?: number;
  maxTilt?: number;
  maxBlur?: number;
  rounded?: string;
  className?: string;
};

export function ScrollTiltedGrid({
  images,
  aspectRatio = "3/4",
  perspective = 900,
  maxTilt = 70,
  maxBlur = 8,
  rounded = "1rem",
  className = "",
}: ScrollTiltedGridProps) {
  const config = useMemo(
    () => ({ aspectRatio, perspective, maxTilt, maxBlur, rounded }),
    [aspectRatio, perspective, maxTilt, maxBlur, rounded],
  );

  return (
    <div className={`mx-auto grid w-full grid-cols-2 gap-6 md:gap-10 py-[10vh] ${className}`}>
      {images.map((src, i) => (
        <Tile key={`${src}-${i}`} src={src} side={i % 2 === 0 ? "L" : "R"} config={config} />
      ))}
    </div>
  );
}
