import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";
import { Navbar } from "@/gemini/components/Navbar";
import { Hero } from "@/gemini/components/Hero";
import { Preloader } from "@/gemini/components/Preloader";
import { CinematicFooter } from "@/gemini/components/ui/motion-footer";




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

  return (
    <div className="relative min-h-screen gemini-root bg-[#0a0a0a] text-zinc-100 [overflow-x:clip]">
      {isLoading ? (
        <Preloader onComplete={() => setIsLoading(false)} />
      ) : (
        <>
          <CustomCursor />
          <NoiseOverlay />
          <Navbar />
          <main>
            <Hero />
          </main>
          <CinematicFooter />


        </>
      )}
    </div>
  );
};

export default Index;
