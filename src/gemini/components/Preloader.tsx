import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Terminal, Activity, Zap } from "@/components/icons/hugeicons";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [percent, setPercent] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const logs = [
    "INITIALISATION DU SYSTÈME...",
    "CHARGEMENT DES COMPOSANTS STRATÉGIQUES...",
    "INTÉGRATION DE L'EXCELLENCE CRÉATIVE...",
    "DIALECTIQUE PRODUIT & IMPACT...",
    "CONSTRUCTION DE L'INTERFACE SYNCHRONE...",
    "MARIE JANVIER KITCHO ● PORTFOLIO COMPILÉ",
    "RE-RE-REMIXING EXPERIENCE V2.4...",
    "DÉVERROUILLAGE DES SYSTÈMES CRÉATIFS...",
  ];

  useEffect(() => {
    // Fast but organic digital loading countdown
    let current = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 8) + 3; // jump 3 to 10
      current = Math.min(current + increment, 100);
      setPercent(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onComplete();
          }, 1000); // allow animations to finish
        }, 800);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (percent < 100) {
      const index = Math.min(
        Math.floor((percent / 100) * logs.length),
        logs.length - 1
      );
      setLogIndex(index);
    } else {
      setLogIndex(logs.length - 1);
    }
  }, [percent]);

  // Letters of the title for staggered animation
  const titleLetters = "MARIE JANVIER".split("");

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="preloader-container"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Two sliding shutters for opening curtains reveal effect */}
          <div className="absolute inset-0 pointer-events-none flex flex-col z-0">
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: isExiting ? "-100%" : 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="w-full flex-1 bg-zinc-950 border-b border-white/5 relative"
            >
              {/* Scanline and grain inside shutters */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 via-transparent to-brand-orange/5 opacity-30" />
            </motion.div>
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: isExiting ? "100%" : 0 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="w-full flex-1 bg-zinc-950 border-t border-white/5 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-500/5 via-transparent to-zinc-500/5 opacity-30" />
            </motion.div>
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8 text-center space-y-12">
            
            {/* Top Indicator: Micro Signal Line */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 px-3 py-1 bg-zinc-900/60 border border-white/10 rounded-full"
            >
              <Activity className="w-3 h-3 text-brand-orange animate-pulse" />
              <span className="text-[8px] font-mono font-black tracking-[0.25em] text-zinc-400 uppercase">
                SYSTEME ACTIF COM.MJ
              </span>
            </motion.div>

            {/* Glowing Logo Central Ring / Pulsing Orb */}
            <div className="relative flex items-center justify-center w-36 h-36">
              {/* Outer circle layout */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-zinc-900 fill-none"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="72"
                  cy="72"
                  r="62"
                  className="stroke-brand-orange fill-none"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 62}
                  strokeDashoffset={2 * Math.PI * 62 * (1 - percent / 100)}
                  transition={{ ease: "easeOut" }}
                />
              </svg>

              {/* Central text displaying percentage */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  className="text-3xl font-black font-mono tracking-tighter text-white"
                  key={percent}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  {percent}%
                </motion.span>
                <span className="text-[7.5px] font-mono uppercase tracking-[0.3em] text-[#10b981] font-bold mt-1">
                  CHARGEMENT
                </span>
              </div>

              {/* Glowing back lights */}
              <div className="absolute inset-0 bg-brand-orange/5 rounded-full blur-2xl animate-pulse" />
            </div>

            {/* Text Title Reveal */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-[0.35em] text-white flex justify-center uppercase font-display select-none">
                {titleLetters.map((char, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 15, rotate: 15 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{
                      delay: idx * 0.05,
                      type: "spring",
                      stiffness: 220,
                      damping: 18,
                    }}
                    className={char === " " ? "mx-1.5" : "inline-block"}
                  >
                    {char}
                  </motion.span>
                ))}
              </h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.6 }}
                className="text-zinc-500 text-[10px] font-mono tracking-[0.3em]"
              >
                PRODUIT ● STRATÉGIE ● DIRECTION
              </motion.div>
            </div>

            {/* Interactive Running Code Terminal Logs */}
            <div className="w-full bg-zinc-950/90 border border-white/5 p-4 rounded-xl min-h-[64px] flex items-center justify-center shadow-inner relative overflow-hidden">
              <div className="absolute top-1 right-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                <span className="text-[6px] font-mono text-zinc-600">ONLINE</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={logIndex}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-[9px] font-mono text-emerald-400 font-bold tracking-wider leading-relaxed text-center uppercase"
                >
                  {logs[logIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
