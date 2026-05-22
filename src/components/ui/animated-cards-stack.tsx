"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

const cardVariants = cva("absolute will-change-transform", {
  variants: {
    variant: {
      dark: "flex size-full flex-col items-center justify-center gap-6 rounded-2xl border border-white/10 bg-zinc-950/80 p-6 backdrop-blur-md",
      light:
        "flex size-full flex-col items-center justify-center gap-6 rounded-2xl border bg-background/80 p-6 backdrop-blur-md",
    },
  },
  defaultVariants: { variant: "dark" },
});

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}
const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined);
function useContainerScrollContext() {
  const ctx = React.useContext(ContainerScrollContext);
  if (!ctx) throw new Error("useContainerScrollContext must be used within ContainerScroll");
  return ctx;
}

export const ContainerScroll: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  style,
  ...props
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start center", "end end"],
  });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative w-full", className)}
        style={{ minHeight: "120vh", ...style }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};
ContainerScroll.displayName = "ContainerScroll";

export const CardsContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={cn(
        "sticky left-0 top-0 flex h-screen w-full items-center justify-center",
        className,
      )}
      style={{ perspective: "1000px", ...style }}
      {...props}
    >
      <div
        className="relative h-[60vh] w-full max-w-2xl mx-auto"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
};
CardsContainer.displayName = "CardsContainer";

interface CardStickyProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof cardVariants> {
  arrayLength: number;
  index: number;
  incrementY?: number;
  incrementZ?: number;
  incrementRotation?: number;
}

export const CardTransformed = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      arrayLength,
      index,
      incrementY = 10,
      incrementZ = 10,
      incrementRotation,
      className,
      variant,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const rotationDefault = -index + 90;
    const rot = incrementRotation ?? rotationDefault;
    const { scrollYProgress } = useContainerScrollContext();

    const start = index / (arrayLength + 1);
    const end = (index + 1) / (arrayLength + 1);
    const range = React.useMemo(() => [start, end], [start, end]);
    const rotateRange = React.useMemo(
      () => [range[0] - 1.5, range[1] / 1.5],
      [range],
    );

    const y = useTransform(scrollYProgress, range as [number, number], ["0%", "-180%"]);
    const rotate = useTransform(
      scrollYProgress,
      rotateRange as [number, number],
      [rot, 0],
    );
    const transform = useMotionTemplate`translateZ(${index * incrementZ}px) translateY(${y}) rotate(${rotate}deg)`;

    const cardStyle = {
      top: index * incrementY,
      transform,
      backfaceVisibility: "hidden",
      zIndex: (arrayLength - index) * incrementZ,
      ...style,
    } as React.CSSProperties;

    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ variant }), className)}
        style={cardStyle}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
CardTransformed.displayName = "CardTransformed";
