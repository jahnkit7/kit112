import { lazy, Suspense, useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";
import { Hero } from "@/gemini/components/Hero";
import { Preloader } from "@/gemini/components/Preloader";
import BackgroundMusic from "@/components/BackgroundMusic";

const CinematicFooter = lazy(() =>
  import("@/gemini/components/ui/motion-footer").then((module) => ({
    default: module.CinematicFooter,
  })),
);



const NoiseOverlay = () => <div className="noise-overlay" />;

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ translateX: cursorX, translateY: cursorY }}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-black pointer-events-none z-[9999] mix-blend-difference hidden md:block"
    />
  );
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showCinematicFooter, setShowCinematicFooter] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setShowCinematicFooter(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <div className="relative min-h-screen gemini-root bg-[#0a0a0a] text-zinc-100 [overflow-x:clip]">
      {isLoading ? (
        <Preloader onComplete={() => setIsLoading(false)} />
      ) : (
        <>
          <CustomCursor />
          <NoiseOverlay />
          <main>
            <Hero />
          </main>
          {showCinematicFooter && (
            <Suspense fallback={null}>
              <CinematicFooter />
            </Suspense>
          )}


        </>
      )}
    </div>
  );
};

export default Index;
