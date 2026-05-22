import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

type TOverflowType = "x" | "y" | "both";

interface ScrollerProps {
  children: React.ReactNode;
  overflow: TOverflowType;
  height?: number | string;
  width?: number | string;
  withButtons?: boolean;
  childrenContainerClassName?: string;
}

export const Scroller = ({
  children,
  overflow,
  height = "100%",
  width = "100%",
  withButtons,
  childrenContainerClassName,
}: ScrollerProps) => {
  const items = React.Children.toArray(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTopOverlay, setShowTopOverlay] = useState(false);
  const [showBottomOverlay, setShowBottomOverlay] = useState(false);
  const [showLeftOverlay, setShowLeftOverlay] = useState(false);
  const [showRightOverlay, setShowRightOverlay] = useState(false);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index);
      itemsRef.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = containerRef.current;
        setShowTopOverlay((overflow === "y" || overflow === "both") && scrollTop > 0);
        setShowBottomOverlay((overflow === "y" || overflow === "both") && scrollTop + clientHeight < scrollHeight - 1);
        setShowLeftOverlay((overflow === "x" || overflow === "both") && scrollLeft > 0);
        setShowRightOverlay((overflow === "x" || overflow === "both") && scrollLeft + clientWidth < scrollWidth - 1);
      }
    };
    handleScroll();
    const el = containerRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [overflow]);

  return (
    <div className="relative" style={{ height, width }}>
      {withButtons && overflow === "y" && (
        <div className="absolute right-2 top-2 z-20 flex flex-col gap-1.5">
          <button onClick={() => scrollToIndex(Math.max(currentIndex - 1, 0))} className="w-9 h-9 rounded-full bg-zinc-900/80 border border-white/10 text-white/70 hover:text-white hover:bg-zinc-800 flex items-center justify-center backdrop-blur-md transition">
            <ChevronUp size={16} />
          </button>
          <button onClick={() => scrollToIndex(Math.min(currentIndex + 1, items.length - 1))} className="w-9 h-9 rounded-full bg-zinc-900/80 border border-white/10 text-white/70 hover:text-white hover:bg-zinc-800 flex items-center justify-center backdrop-blur-md transition">
            <ChevronDown size={16} />
          </button>
        </div>
      )}
      <div
        ref={containerRef}
        className={clsx(
          "w-full h-full",
          overflow === "y" && "overflow-y-auto overflow-x-hidden",
          overflow === "x" && "overflow-x-auto overflow-y-hidden flex",
          overflow === "both" && "overflow-auto",
          childrenContainerClassName,
        )}
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((child, index) => (
          <div
            key={index}
            ref={(el) => (itemsRef.current[index] = el)}
            className={overflow === "x" ? "shrink-0" : ""}
          >
            {child}
          </div>
        ))}
      </div>
      {withButtons && overflow === "x" && (
        <div className="absolute right-2 bottom-2 z-20 flex gap-1.5">
          <button onClick={() => scrollToIndex(Math.max(currentIndex - 1, 0))} className="w-9 h-9 rounded-full bg-zinc-900/80 border border-white/10 text-white/70 hover:text-white hover:bg-zinc-800 flex items-center justify-center backdrop-blur-md transition">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scrollToIndex(Math.min(currentIndex + 1, items.length - 1))} className="w-9 h-9 rounded-full bg-zinc-900/80 border border-white/10 text-white/70 hover:text-white hover:bg-zinc-800 flex items-center justify-center backdrop-blur-md transition">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
      {showTopOverlay && <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10" />}
      {showBottomOverlay && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />}
      {showLeftOverlay && <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />}
      {showRightOverlay && <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />}
    </div>
  );
};
