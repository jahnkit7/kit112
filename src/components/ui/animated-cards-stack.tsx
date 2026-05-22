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
        data-cards-scroll-section
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

type CardsContainerProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children?: React.ReactNode;
};

export const CardsContainer: React.FC<CardsContainerProps> = ({
  children,
  className,
  style,
  ...props
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [mobilePin, setMobilePin] = React.useState({
    enabled: false,
    start: 0,
    distance: 0,
  });

  React.useEffect(() => {
    const updatePin = () => {
      const el = containerRef.current;
      const stream = el?.closest("[data-mobile-stream-inner]") as HTMLElement | null;
      const section = el?.closest("[data-cards-scroll-section]") as HTMLElement | null;
      const enabled = window.innerWidth < 1024 && Boolean(el && stream && section);

      if (!enabled || !stream || !section) {
        setMobilePin({ enabled: false, start: 0, distance: 0 });
        return;
      }

      const sectionTop = section.getBoundingClientRect().top - stream.getBoundingClientRect().top;
      const desiredTop = window.innerHeight * 0.08;
      const cardStageHeight = window.innerHeight * 0.76;
      setMobilePin({
        enabled: true,
        start: sectionTop - desiredTop,
        distance: Math.max(window.innerHeight * 1.2, section.offsetHeight - cardStageHeight),
      });
    };

    updatePin();
    window.addEventListener("resize", updatePin, { passive: true });
    return () => window.removeEventListener("resize", updatePin);
  }, []);

  const pinnedY = useTransform(scrollY, (latest) => {
    if (!mobilePin.enabled) return 0;
    return Math.min(Math.max(latest - mobilePin.start, 0), mobilePin.distance);
  });

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative flex h-[76vh] w-full items-center justify-center lg:sticky lg:left-0 lg:top-0 lg:h-screen",
        className,
      )}
      style={{ y: pinnedY, perspective: "1000px", ...style }}
      {...props}
    >
      <div
        className="relative mx-auto h-[42vh] min-h-[280px] max-h-[360px] w-[min(100%,18.5rem)] sm:w-[min(100%,24rem)] lg:h-[46vh] lg:min-h-[340px] lg:max-h-[440px] lg:w-[min(100%,34rem)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </motion.div>
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
    const transform = useMotionTemplate`translateZ(${(arrayLength - index) * incrementZ}px) translateY(${y}) rotate(${rotate}deg)`;

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
