import { motion } from 'motion/react';
import { Home, Target, Briefcase, Mail, User, Sun } from "@/components/icons/hugeicons";

export const Navbar = () => {
  const menuItems = [
    { icon: <Home size={20} />, href: "#", label: "Home" },
    { icon: <User size={20} />, href: "#about", label: "Vision" },
    { icon: <Target size={20} />, href: "#expertise", label: "Expertise" },
    { icon: <Briefcase size={20} />, href: "#portfolio", label: "Projets" },
    { icon: <Mail size={20} />, href: "#contact", label: "Contact" },
  ];

  return (
    <>
      {/* Floating Sidebar Menu */}
      <motion.nav 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-3.5 items-center"
      >
        <div className="p-2 rounded-full bg-zinc-950/85 backdrop-blur-md border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-1.5">
          {menuItems.map((item, idx) => (
            <a 
              key={idx}
              href={item.href}
              className="w-11 h-11 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 group relative"
            >
              {item.icon}
              <span className="absolute right-14 bg-zinc-950 border border-white/10 text-zinc-100 text-[10px] uppercase font-black tracking-widest px-3 py-2 rounded-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-2xl">
                {item.label}
              </span>
            </a>
          ))}
        </div>
        
        <button className="w-11 h-11 rounded-full bg-zinc-950/85 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center shadow-xl hover:scale-105 transition-all duration-350">
          <Sun size={18} />
        </button>
      </motion.nav>
    </>
  );
};
