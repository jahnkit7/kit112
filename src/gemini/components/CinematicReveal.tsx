import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { useRef, type ReactNode, type ElementType } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

// Viewport config — trigger when element is comfortably in view so the
// animation is actually witnessed by the user (not played before arrival).
const VIEWPORT = { once: true, amount: 0.25 } as const;
const VIEWPORT_LIST = { once: true, amount: 0.15 } as const;

interface MaskRevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  direction?: "up" | "right";
}

/** Reveals child behind a clip-path mask that wipes open. Cinematic editorial reveal. */
export const MaskReveal = ({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  duration = 1.3,
  once = true,
  direction = "up",
}: MaskRevealProps) => {
  const initial =
    direction === "up"
      ? { clipPath: "inset(100% 0 0 0)", y: "14%" }
      : { clipPath: "inset(0 100% 0 0)", y: 0 };
  const animate = { clipPath: "inset(0% 0 0 0)", y: 0 };
  const MotionTag: any = (motion as any)[Tag as string] ?? motion.div;
  return (
    <MotionTag
      initial={initial}
      whileInView={animate}
      viewport={{ once, amount: 0.25 }}
      transition={{ duration, ease: EASE, delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

interface WordStaggerProps {
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

/** Splits text into words and reveals them with a soft upward stagger. */
export const WordStagger = ({
  text,
  as: Tag = "h2",
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.11,
  once = true,
}: WordStaggerProps) => {
  const words = text.split(" ");
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const child: Variants = {
    hidden: { y: "115%", opacity: 0, filter: "blur(10px)" },
    show: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 1.05, ease: EASE },
    },
  };
  const MotionTag: any = (motion as any)[Tag as string] ?? motion.div;
  return (
    <MotionTag
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.2 }}
      className={className}
    >
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom pb-[0.08em] pr-[0.2em]"
        >
          <motion.span variants={child} className={`inline-block ${wordClassName}`}>
            {w}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
};

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
}

/** Soft fade + slide + blur reveal for body text and cards. */
export const BlurFade = ({
  children,
  className = "",
  delay = 0,
  y = 48,
  duration = 1.05,
  once = true,
}: BlurFadeProps) => (
  <motion.div
    initial={{ opacity: 0, y, filter: "blur(14px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once, amount: 0.25 }}
    transition={{ duration, ease: EASE, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
}

/** Wrap a list/grid and add `data-stagger` items inside. Each direct child reveals in sequence. */
export const StaggerList = ({
  children,
  className = "",
  stagger = 0.16,
  delay = 0.05,
  once = true,
}: StaggerListProps) => {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 60, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: EASE },
  },
};

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Pixels of vertical drift across the section. Negative = upward drift. */
  offset?: number;
}

/** Subtle scroll-linked parallax wrapper. */
export const Parallax = ({ children, className = "", offset = -60 }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};
