import { useRef, useState, useEffect, ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionTemplate,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Download,
  MessageCircle,
  Globe,
  ArrowUpRight,
  Target,
  Zap,
  Rocket,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  Lock,
  Unlock,
  Home,
  User,
  Briefcase,
  Mail,
  ChevronDown,
  Layers,
  Palette,
  TrendingUp,
  Settings,
  UtensilsCrossed,
  Printer,
  Phone,
  Whatsapp,
  GalleryAlbum,
  X,
  Sparkles,
  Activity,
  CheckCircle2,
  FileText,
} from "@/components/icons/hugeicons";
import { Project } from "../types";
import {
  exhibitions,
  education,
  projects,
  expertise,
  statistics,
} from "../data";
import { ImageViewer } from "./ImageViewer";
import { useSetting } from "@/hooks/useSiteSettings";
import type { ExperienceItem } from "@/hooks/useSiteSettings";
import {
  MaskReveal,
  WordStagger,
  BlurFade,
  StaggerList,
  staggerItem,
} from "./CinematicReveal";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { VerticalImageStack } from "@/components/ui/vertical-image-stack";
import { ScrollTiltedGrid } from "@/components/ui/scroll-tilted-grid";
import { Scroller } from "@/components/ui/scroller-1";
import ImmersiveScrollGallery from "@/components/ui/immersive-scroll-gallery";
import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";

import { ContainerScroll, CardsContainer, CardTransformed } from "@/components/ui/animated-cards-stack";
import mjkLogo from "@/assets/mjk-logo.svg";

// Lightweight gradient placeholders — zero network, GPU friendly.
// We rotate through a small palette so each parcours feels distinct.
const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg,#3a1f1f 0%,#7a2e1f 50%,#c44a2a 100%)",
  "linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)",
  "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
  "linear-gradient(135deg,#2d1b3d 0%,#5b2a86 50%,#a16ae8 100%)",
  "linear-gradient(135deg,#1b3a2a 0%,#2d5a3d 50%,#5a8a5c 100%)",
  "linear-gradient(135deg,#3d2b1f 0%,#6b3a2a 50%,#cd7f32 100%)",
];

const PARCOURS_EASE = [0.16, 1, 0.3, 1] as const;

const PARCOURS_REVEAL: Variants = {
  hidden: { opacity: 0, y: 56, filter: "blur(14px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: PARCOURS_EASE },
  },
};

const PARCOURS_CHILD_REVEAL: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: PARCOURS_EASE } },
};

// Inline SVG placeholder kept for legacy modal grids (zero network cost).
const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'><rect width='4' height='3' fill='%23222'/><text x='2' y='1.7' font-family='monospace' font-size='0.35' fill='%23666' text-anchor='middle'>placeholder</text></svg>";

interface ParcoursItemProps {
  title: string;
  subtitle: string;
  description: string;
  year: string;
  index: number;
}

const ParcoursItem = ({
  title,
  subtitle,
  description,
  year,
  index,
}: ParcoursItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const railItems: FocusRailItem[] = Array.from({ length: 5 }, (_, i) => ({
    id: `${index}-${i}`,
    title: `${title.split("·").pop()?.trim() || "Projet"} ${String(i + 1).padStart(2, "0")}`,
    description,
    meta: year,
    gradient: PLACEHOLDER_GRADIENTS[(index + i) % PLACEHOLDER_GRADIENTS.length],
  }));

  const titleParts = title.split("·");

  return (
    <motion.div
      variants={PARCOURS_REVEAL}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.22 }}
      transition={{ layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
      className="py-8 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start"
    >
      <motion.div variants={PARCOURS_CHILD_REVEAL} className="md:col-span-3 space-y-4 md:space-y-5">
        <span className="block text-xl md:text-2xl font-black font-sans tracking-tight text-white">
          {year}
        </span>

        <FocusRail items={railItems} compact className="max-w-[16rem] md:max-w-none" />

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="group inline-flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-white/60 transition hover:text-white"
        >
          {expanded ? "Réduire" : "Plus d'infos"}
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown size={14} />
          </motion.span>
        </button>
      </motion.div>

      <motion.div variants={PARCOURS_CHILD_REVEAL} className="md:col-span-9 space-y-4 md:space-y-5">
        <div className="space-y-3">
          <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/40 uppercase">
            {subtitle}
          </div>
          <h3 className="text-xl md:text-3xl font-black leading-[1.15] tracking-tight text-white">
            {titleParts.map((part, i) => (
              <span key={i} className={i === 1 ? "text-white/30 block md:inline" : ""}>
                {i === 1 ? ` for ${part.trim()}` : part.trim()}
              </span>
            ))}
          </h3>
          <p className="text-sm md:text-base font-light max-w-2xl leading-relaxed text-white/50">
            {description}
          </p>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="content"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-2 md:pt-4 space-y-4 md:space-y-5">
                <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-2xl">
                  {description} Plus de détails, captures et explorations
                  visuelles à venir pour ce projet.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                  {railItems.map((item, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl border border-white/5"
                      style={{ background: item.gradient }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

interface ExpertiseCardProps {
  item: (typeof expertise)[number];
  index: number;
  meta: {
    icon: typeof Layers;
    accent: string;
  };
}

const ExpertiseCard = ({ item, index, meta }: ExpertiseCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const reduceMotion = useReducedMotion();
  const isMobileCard = typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
  const direction = index % 2 === 0 ? -1 : 1;
  const Icon = meta.icon;

  const shellY = useTransform(scrollYProgress, [0, 0.5, 1], ["100%", "0%", "-100%"]);
  const shellZ = useTransform(scrollYProgress, [0, 0.5, 1], [300, 0, 300]);
  const shellRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [55, 0, -55]);
  const shellX = useTransform(scrollYProgress, [0, 0.5, 1], [`${direction * 40}%`, "0%", `${direction * 40}%`]);
  const shellRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-direction * 5, 0, direction * 5]);
  const shellSkewX = useTransform(scrollYProgress, [0, 0.5, 1], [direction * 20, 0, -direction * 20]);
  const shellScaleY = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.08]);
  const shellBorder = useTransform(scrollYProgress, [0, 0.5, 1], [0.08, 0.16, 0.08]);
  const shellShadow = useTransform(scrollYProgress, [0, 0.5, 1], [0.22, 0.34, 0.22]);
  const cardFilter = useMotionTemplate`drop-shadow(0 24px 60px rgba(0,0,0,${shellShadow}))`;
  const borderColor = useMotionTemplate`rgba(255,255,255,${shellBorder})`;

  const cardShell = (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-[1.75rem] border bg-gradient-to-b from-zinc-950 via-black to-black"
      style={{ borderColor }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/32 to-black/70" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] transition-opacity duration-700 group-hover:opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 100%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 100%, black 0%, transparent 75%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full blur-3xl opacity-40 transition-opacity duration-700 group-hover:opacity-60"
        style={{ background: `radial-gradient(circle, ${meta.accent} 0%, transparent 70%)` }}
      />
      <span
        className="pointer-events-none absolute -top-6 -right-2 select-none font-display text-[8rem] font-black leading-none tracking-tighter text-white/[0.06] transition-colors duration-700 group-hover:text-white/[0.1]"
        aria-hidden
      >
        {item.id}
      </span>
      <div
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(to right, transparent, ${meta.accent}, transparent)` }}
      />
    </motion.div>
  );

  const cardContent = (
    <div className="pointer-events-none absolute inset-0 z-10 flex min-h-[320px] flex-col p-7 md:p-8">
      <div className="mb-10 flex items-start justify-between">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-2xl blur-xl opacity-50 transition-opacity duration-500 group-hover:opacity-90"
            style={{ background: meta.accent }}
          />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/35 backdrop-blur-md transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
            <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
          </div>
        </div>
        <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-300 transition-colors group-hover:text-white">
          / {item.id}
        </span>
      </div>

      <div className="mt-auto space-y-4">
        <h4 className="max-w-[12ch] text-xl md:text-[2rem] font-black uppercase leading-[0.95] tracking-tight text-white text-balance [text-shadow:0_8px_28px_rgba(0,0,0,0.75)]">
          {item.title}
        </h4>
        <p className="max-w-[34ch] text-[15px] font-light leading-[1.75] text-white/92 [text-shadow:0_6px_22px_rgba(0,0,0,0.9)]">
          {item.description}
        </p>
      </div>
    </div>
  );

  if (reduceMotion) {
    return (
      <article ref={ref} className="group relative h-full min-h-[320px]">
        {cardShell}
        {cardContent}
      </article>
    );
  }

  return (
    <article ref={ref} style={{ perspective: "900px" }} className="group relative h-full min-h-[320px]">
      <motion.div
        style={{ y: shellY, z: shellZ, rotateX: shellRotateX, transformStyle: "preserve-3d" }}
        className="absolute inset-0"
      >
        <motion.div
          style={{ x: shellX, rotate: shellRotate, skewX: shellSkewX, scaleY: shellScaleY, filter: cardFilter }}
          className="relative h-full will-change-transform"
        >
          {cardShell}
          {cardContent}
        </motion.div>
      </motion.div>
    </article>
  );
};

interface ToolsRowProps {
  name: string;
  description: string;
  percentage: number;
  icon: ReactNode;
  index: number;
  key?: string | number;
}

const ToolsRow = ({
  name,
  description,
  percentage,
  icon,
  index,
}: ToolsRowProps) => {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-8 border-b border-white/5 last:border-b-0 group">
      {/* Tool Info */}
      <div className="flex items-center gap-4">
        {/* Animated Icon Circle */}
        <motion.div
          whileHover={{ scale: 1.08, rotate: 3 }}
          className="w-14 h-14 rounded-full bg-zinc-900/80 border border-white/5 flex items-center justify-center shadow-md relative overflow-hidden z-10 shrink-0 select-none"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-white/[0.02] to-white/[0.05]" />
          {icon}
        </motion.div>
        <div>
          <h4 className="text-lg font-black text-white/95 group-hover:text-white transition-colors">
            {name}
          </h4>
          <p className="text-xs text-zinc-500 font-light font-sans mt-0.5">
            {description}
          </p>
        </div>
      </div>

      {/* Slider Progress Bar */}
      <motion.div
        ref={ref}
        whileInView={{ opacity: 1 }}
        onViewportEnter={() => setHasAnimated(true)}
        viewport={{ once: true }}
        className="w-full sm:w-80 h-14 rounded-full bg-zinc-900/40 border border-white/5 relative overflow-hidden flex items-center p-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] cursor-default shrink-0"
      >
        {/* Transparent filled track containing the knob */}
        <motion.div
          initial={{ width: "30%" }}
          animate={{ width: hasAnimated ? `${percentage}%` : "30%" }}
          transition={{
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            delay: index * 0.15,
          }}
          className="h-full rounded-full bg-gradient-to-r from-brand-orange/5 to-brand-orange/15 border-r border-brand-orange/10 relative min-w-[84px]"
        >
          {/* The Slide Knob containing the percentage text */}
          <div className="absolute top-1 bottom-1 right-1 w-20 rounded-full bg-[#161619] border border-white/10 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.6)] select-none">
            <span className="text-[11px] font-black tracking-widest text-zinc-100 font-mono">
              {percentage} %
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const toolsData = [
  {
    name: "Figma",
    description: "Leading design tool",
    percentage: 80,
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="scale-95"
      >
        <path
          d="M12 6C12 7.65685 13.3431 9 15 9C16.6569 9 18 7.65685 18 6C18 4.34315 16.6569 3 15 3C13.3431 3 12 4.34315 12 6Z"
          fill="#1ABCFE"
        />
        <path
          d="M6 18C6 19.6569 7.34315 21 9 21C10.6569 21 12 19.6569 12 18V15H9C7.34315 15 6 16.3431 6 18Z"
          fill="#0ACF83"
        />
        <path
          d="M6 12C6 13.6569 7.34315 15 9 15H12V9H9C7.34315 9 6 10.3431 6 12Z"
          fill="#A259FF"
        />
        <path
          d="M6 6C6 7.65685 7.34315 9 9 9H12V3H9C7.34315 3 6 4.34315 6 6Z"
          fill="#F24E1E"
        />
        <path
          d="M12 15C12 13.3431 13.3431 12 15 12C16.6569 12 18 13.3431 18 15C18 16.6569 16.6569 18 15 18C13.3431 18 12 16.6569 12 15Z"
          fill="#FF7262"
        />
      </svg>
    ),
  },
  {
    name: "Framer",
    description: "No-code website builder",
    percentage: 90,
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-[18px] h-[18px] fill-current text-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 2h14v6H5V2zm0 6h14v6H11l-6 6V8z" />
      </svg>
    ),
  },
  {
    name: "Adobe Photoshop",
    description: "Raster graphics editor",
    percentage: 60,
    icon: (
      <span className="text-xs font-black text-[#00c8ff] font-sans tracking-tighter leading-none select-none">
        Ps
      </span>
    ),
  },
];

const testimonialsData = [
  {
    id: 1,
    quote:
      "La structuration de nos processus opérationnels par Marie a radicalement changé notre efficacité sur le terrain. Une expertise rare.",
    author: "Sophie M.",
    role: "Direction Opérationnelle",
    avatar: "/assets/images/portfolio_1_1779296273783.png",
    logo: "PROJET ODAXIA",
  },
  {
    id: 2,
    quote:
      "GoteaT est la preuve vivante qu'un concept bien designé et rigoureusement exécuté peut s'imposer sur le marché dakarois.",
    author: "Amadou B.",
    role: "Partenaire Stratégique",
    avatar: "/assets/images/portfolio_2_1779296292371.png",
    logo: "GOTEAT",
  },
  {
    id: 3,
    quote:
      "Une capacité exceptionnelle à relier la vision créative aux réalités du business. Marie est une bâtisseuse de produits hors pair.",
    author: "Jean-Philippe D.",
    role: "Entrepreneur Tech",
    avatar: "/assets/images/hero_portrait.jpg",
    logo: "PRODUCT LAB",
  },
  {
    id: 4,
    quote:
      "Sa méthode nous a donné une direction lisible, des priorités nettes et une exécution beaucoup plus fluide dès les premières semaines.",
    author: "Aïcha N.",
    role: "Fondatrice Retail",
    avatar: "/assets/images/portfolio_1_1779296273783.png",
    logo: "BRAND OPS",
  },
  {
    id: 5,
    quote:
      "Marie a transformé une idée dispersée en expérience cohérente, désirable et prête à être lancée sans perdre notre exigence business.",
    author: "Karim S.",
    role: "CEO Studio Digital",
    avatar: "/assets/images/portfolio_2_1779296292371.png",
    logo: "LAUNCH STUDIO",
  },
];

const visionCards = [
  {
    title: "Notre Vision",
    subtitle: "Observe & Structurer",
    content:
      "Transformer l'intuition en offre lisible, process simple et architecture produit en comprenant les usages du marché réel.",
    icon: <Target className="w-8 h-8 text-brand-orange" />,
    color: "bg-zinc-950 text-white",
  },
  {
    title: "Notre Mission",
    subtitle: "Designer & Créer",
    content:
      "Bâtir une présence claire : identité forte, interface fluide et expérience utilisateur mémorable pour chaque point de contact.",
    icon: <Zap className="w-8 h-8 text-brand-orange" />,
    color: "bg-zinc-900/60 text-white border border-white/5",
  },
  {
    title: "Notre Engagement",
    subtitle: "Exécuter & Déployer",
    content:
      "Lancer vite, tester sur le terrain, ajuster et stabiliser vos systèmes opérationnels pour une croissance durable.",
    icon: <Rocket className="w-8 h-8 text-brand-orange" />,
    color: "bg-zinc-950 text-white",
  },
];

const projectDescriptions: Record<string, string> = {
  "1": "Création d'un univers visuel complet et d'un positionnement stratégique novateur pour bousculer les codes du prêt-à-porter haut de gamme.",
  "2": "Conception UX globale et architecture de services mobiles dédiés à un nouvel éco-système de mode connectée.",
  "3": "Cartographie sensible, interfaces immersives et design d'interaction pour un outil d'exploration urbaine et éditoriale.",
  "4": "Clarification de l'offre B2B, modélisation opérationnelle et design de marque pour le cabinet conseil panafricain Odaxia.",
  "5": "Recherche utilisateur, prototypage et interface épurée pour une plateforme d'échange de services décentralisée.",
  "6": "Une identité graphique forte fondée sur l'élégance hospitalière sénégalaise, mariant authenticité et codes contemporains."
};

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isCollabHovered, setIsCollabHovered] = useState(false);
  const [isIslandHovered, setIsIslandHovered] = useState(false);
  const [portfolioLayout, setPortfolioLayout] = useState<"grid" | "cinematic">("grid");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [phoneImage, setPhoneImage] = useState(
    "/assets/images/hero_portrait.jpg",
  );
  const [activeSection, setActiveSection] = useState("home");
  const [activeDockAction, setActiveDockAction] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [dockScreen, setDockScreen] = useState<null | "phone" | "message" | "whatsapp">(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Array<{ from: "me" | "mjk"; text: string }>>([
    { from: "mjk", text: "Salut 👋 Merci de m'écrire — dis-moi tout sur ton projet." },
  ]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 30);
        ticking = false;
      });
    };
    handleResize();
    handleScroll();
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isPhoneLocked = isMobile ? !isScrolled : !activeProject;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // offset for mobile floating headers
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    } else if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const dockItems: Array<{
    id: string;
    label: string;
    icon: typeof Phone;
    href?: string;
    action?: "gallery";
  }> = [
    { id: "phone", label: "Appeler", icon: Phone, href: "tel:+221781221670" },
    { id: "message", label: "Message", icon: MessageSquare, href: "sms:+221781221670" },
    { id: "whatsapp", label: "WhatsApp", icon: Whatsapp, href: "https://wa.me/221781221670" },
    { id: "gallery", label: "Galerie", icon: GalleryAlbum, action: "gallery" },
  ];

  const handleSelectProject = (project: Project | null) => {
    setActiveProject(project);
    if (project) {
      setPhoneImage(project.image);
    } else {
      setPhoneImage("/assets/images/hero_portrait.jpg");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Notifications dynamiques simulées dans la Dynamic Island
  const notifications = [
    { icon: Sparkles, title: "Nouveau créneau", body: "Dispo dès lundi · 2 slots", tint: "#10b981" },
    { icon: Mail, title: "Nouveau brief", body: "Startup fintech · Dakar", tint: "#FF6B35" },
    { icon: Briefcase, title: "Projet livré", body: "GoteaT · v2 en prod", tint: "#10b981" },
    { icon: Activity, title: "En écoute", body: "Ouvert aux collaborations", tint: "#A78BFA" },
    { icon: CheckCircle2, title: "Mission validée", body: "Direction créative · 6 sem", tint: "#10b981" },
    { icon: Rocket, title: "Lancement", body: "Creative Shop · phase 2", tint: "#FF6B35" },
  ];

  useEffect(() => {
    let cancelled = false;
    let showT: ReturnType<typeof setTimeout>;
    const cycle = () => {
      if (cancelled) return;
      setShowNotification(true);
      showT = setTimeout(() => {
        if (cancelled) return;
        setShowNotification(false);
        setTimeout(() => {
          if (cancelled) return;
          setNotificationIndex((i) => (i + 1) % notifications.length);
          cycle();
        }, 1200);
      }, 3800);
    };
    const initial = setTimeout(cycle, 2500);
    return () => {
      cancelled = true;
      clearTimeout(initial);
      clearTimeout(showT);
    };
  }, [notifications.length]);


  const { data: experiencesSetting } = useSetting("experiences");
  const experienceItems: ExperienceItem[] = experiencesSetting?.items?.length
    ? experiencesSetting.items
    : [];
  const educationKeywords = ["formation", "diplôme", "licence", "master", "bts", "université", "école", "certificat", "bac"];
  const isEducation = (it: ExperienceItem) =>
    educationKeywords.some((w) => `${it.role} ${it.company}`.toLowerCase().includes(w));
  const dbCombined = experienceItems.length
    ? experienceItems.map((it, i) => ({
        id: `exp-${i}`,
        title: `${it.role} · ${it.company}`,
        location: it.location || "",
        date: it.period,
        description: it.description || "",
        _education: isEducation(it),
      }))
    : null;
  const combinedData = dbCombined
    ? [...dbCombined.filter((d) => !d._education), ...dbCombined.filter((d) => d._education)]
    : [...exhibitions, ...education].sort((a, b) => b.date.localeCompare(a.date));

  const filteredProjects = projects.filter(
    (p) =>
      activeFilter === "Tous" ||
      p.category.toLowerCase().includes(activeFilter.toLowerCase()),
  );

  // Soft page entrance transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const { scrollY } = useScroll();
  const mobilePhoneOpacity = useTransform(
    scrollY,
    [0, 70, 150],
    [0, 0.98, 1],
  );
  const mobilePhoneScale = useTransform(scrollY, [0, 150], [0.96, 1]);
  const mobileStreamOpacity = useTransform(scrollY, [0, 320, 520], [0, 0, 1]);
  const mobileStreamY = useTransform(scrollY, [320, 520], [28, 0]);
  const mobilePhoneDetailsOpacity = useTransform(scrollY, [0, 45, 260, 420], [0, 1, 1, 0]);
  const mobilePhoneDetailsY = useTransform(scrollY, [260, 420], [0, 18]);

  // Mobile: clip stream content to phone screen rect via fixed wrapper + translate
  const streamInnerRef = useRef<HTMLDivElement>(null);
  const [streamHeight, setStreamHeight] = useState(0);
  useEffect(() => {
    if (!isMobile || !streamInnerRef.current) return;
    const el = streamInnerRef.current;
    const update = () => setStreamHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);
  const mobileStreamTranslateY = useTransform(scrollY, (v) => -v);


  // Shared dock + immersive action screens (phone/message/whatsapp) used inside
  // both the mobile phone chrome and the desktop phone container.
  const dockOverlay = (
    <>
      {/* Immersive Action Screens (Phone / Message / WhatsApp) */}
      <AnimatePresence>
        {dockScreen && (
          <motion.div
            key={dockScreen}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-[60] pointer-events-auto overflow-hidden"
          >
            {dockScreen === "phone" && (
              <div className="relative w-full h-full bg-gradient-to-b from-[#0b1f1a] via-[#0a0a0a] to-[#000] flex flex-col">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_20%,#10b981_0%,transparent_60%)]" />
                <button
                  onClick={() => { setDockScreen(null); setActiveDockAction(null); }}
                  className="absolute top-12 left-4 z-10 text-white/70 text-xs flex items-center gap-1 hover:text-white"
                  aria-label="Retour"
                >
                  <ChevronLeft size={16} /> Retour
                </button>
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-20 px-6">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/80 mb-3">Appel sortant</div>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/40 to-emerald-900/40 border border-emerald-400/30 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(16,185,129,0.35)]">
                    <span className="text-3xl font-bold text-white">MJ</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Marie Janvier</h2>
                  <p className="text-emerald-300/90 text-sm font-mono tracking-wider">+221 78 122 16 70</p>
                  <p className="text-zinc-500 text-[10px] mt-2 uppercase tracking-widest">Senegal · mobile</p>
                </div>
                <div className="relative z-10 pb-10 px-6 flex flex-col items-center gap-3">
                  <motion.a
                    href="tel:+221781221670"
                    whileTap={{ scale: 0.92 }}
                    className="w-16 h-16 rounded-full bg-[#ff3b30] flex items-center justify-center shadow-[0_8px_30px_rgba(255,59,48,0.6)] ring-4 ring-[#ff3b30]/20"
                    aria-label="Lancer l'appel"
                  >
                    <Phone size={26} className="text-white" />
                  </motion.a>
                  <span className="text-[11px] text-white/70 mt-1">Appuyez pour appeler</span>
                </div>
              </div>
            )}

            {dockScreen === "message" && (
              <div className="relative w-full h-full bg-[#000] flex flex-col">
                <div className="flex items-center gap-3 px-3 pt-12 pb-3 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl">
                  <button
                    onClick={() => { setDockScreen(null); setActiveDockAction(null); }}
                    className="text-[#0a84ff]"
                    aria-label="Retour"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <div className="flex-1 flex flex-col items-center -ml-6">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/60 to-emerald-900/60 flex items-center justify-center text-white text-[11px] font-bold">MJ</div>
                    <span className="text-[10px] text-white/70 mt-0.5">Marie Janvier</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] px-3 py-2 rounded-[18px] text-[13px] leading-snug ${
                          m.from === "me"
                            ? "bg-[#0a84ff] text-white rounded-br-[5px]"
                            : "bg-[#1c1c1e] text-white rounded-bl-[5px]"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-2 pt-2 pb-4 bg-[#0a0a0a]/95 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <button
                      className="w-8 h-8 rounded-full bg-[#1c1c1e] flex items-center justify-center text-white/70 hover:text-white shrink-0"
                      aria-label="Joindre une image"
                      onClick={() => setMessages((m) => [...m, { from: "me", text: "📷 Image jointe" }])}
                    >
                      <GalleryAlbum size={15} />
                    </button>
                    <button
                      className="w-8 h-8 rounded-full bg-[#1c1c1e] flex items-center justify-center text-white/70 hover:text-white shrink-0"
                      aria-label="Joindre un fichier"
                      onClick={() => setMessages((m) => [...m, { from: "me", text: "📎 Fichier joint" }])}
                    >
                      <FileText size={14} />
                    </button>
                    <div className="flex-1 flex items-center bg-[#1c1c1e] rounded-full pl-3 pr-1 py-1">
                      <input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && messageInput.trim()) {
                            setMessages((m) => [...m, { from: "me", text: messageInput.trim() }]);
                            setMessageInput("");
                          }
                        }}
                        placeholder="iMessage"
                        className="flex-1 bg-transparent text-[12px] text-white placeholder-white/40 outline-none"
                      />
                      <button
                        onClick={() => {
                          if (!messageInput.trim()) return;
                          setMessages((m) => [...m, { from: "me", text: messageInput.trim() }]);
                          setMessageInput("");
                        }}
                        className="w-7 h-7 rounded-full bg-[#0a84ff] flex items-center justify-center text-white shrink-0"
                        aria-label="Envoyer"
                      >
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {dockScreen === "whatsapp" && (
              <div className="relative w-full h-full bg-gradient-to-b from-[#0a1f17] via-[#0a0a0a] to-[#000] flex flex-col">
                <button
                  onClick={() => { setDockScreen(null); setActiveDockAction(null); }}
                  className="absolute top-12 left-4 z-10 text-white/70 text-xs flex items-center gap-1 hover:text-white"
                  aria-label="Retour"
                >
                  <ChevronLeft size={16} /> Retour
                </button>
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#25D366] flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(37,211,102,0.45)]">
                    <Whatsapp size={36} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">WhatsApp</h2>
                  <p className="text-zinc-400 text-[12px] mb-1">Discutons sur WhatsApp</p>
                  <p className="text-emerald-300/90 text-[11px] font-mono">+221 78 122 16 70</p>
                </div>
                <div className="pb-10 px-6 flex flex-col items-center gap-2">
                  <motion.a
                    href="https://wa.me/221781221670"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.95 }}
                    className="w-full max-w-[220px] py-3 rounded-full bg-[#25D366] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(37,211,102,0.45)]"
                  >
                    <Whatsapp size={18} /> Ouvrir WhatsApp
                  </motion.a>
                  <span className="text-[10px] text-white/40 mt-1">Réponse sous 24h en moyenne</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!dockScreen && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/95 rounded-full px-4 py-3 flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.85)] pointer-events-auto ring-1 ring-white/5">
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeDockAction === item.id;
            const handleClick = () => {
              setActiveDockAction(item.id);
              if (window.navigator?.vibrate) window.navigator.vibrate(15);
              if (item.action === "gallery") {
                setGalleryOpen(true);
              } else if (item.id === "phone" || item.id === "message" || item.id === "whatsapp") {
                setDockScreen(item.id);
              }
            };
            return (
              <button
                key={item.id}
                onClick={handleClick}
                aria-label={item.label}
                className="flex flex-col items-center justify-center relative w-12 h-12 rounded-full transition-all duration-300 pointer-events-auto"
              >
                <Icon
                  size={22}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "text-[#10b981] scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.55)]"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeDockDot"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[#10b981]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <section ref={containerRef} className="relative bg-[#0a0a0a] min-h-screen [overflow-x:clip]">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-red-600/5 blur-[180px] rounded-full opacity-40" />
        <div className="absolute bottom-1/3 -right-1/4 w-[600px] h-[600px] bg-brand-orange/5 blur-[180px] rounded-full opacity-40" />
      </div>

      {/* Mobile Ambient Portrait/Project image backdrop */}
      <div className="hidden fixed inset-0 lg:hidden overflow-hidden z-0 pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={phoneImage}
            src={phoneImage}
            alt="Marie Janvier"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.35]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/85 to-[#0a0a0a]/35" />
      </div>

      {/* Mobile/Tablet top logo removed — logo now displayed inline above the headline */}


      {/* Mobile phone screen chrome: masks are clipped to the inner screen rectangle only */}
      {isMobile && (
        <div
          className={`fixed inset-x-0 top-[4vh] z-[55] mx-auto h-[92vh] max-h-[900px] w-[92vw] max-w-[460px] rounded-[52px] border-[10px] border-[#161619] shadow-[0_12px_30px_rgba(0,0,0,0.7)] ring-1 ring-white/10 pointer-events-none overflow-hidden transition-opacity duration-500 lg:hidden ${
            isScrolled ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        >
          <div className="absolute inset-0 rounded-[40px] overflow-hidden">
            {dockOverlay}
          </div>
        </div>
      )}



      <div className="max-w-[1600px] mx-auto w-full px-0 lg:px-10 relative z-10 py-0 lg:py-6">
        {/* Sticky Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.55fr)] gap-8 lg:gap-12 items-start">
          {/* Left Column: Portrait Card (Sticky on desktop with tactile smartphone styling) */}
          <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] w-full flex justify-center items-center lg:z-30 min-w-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: -30 }}
              animate={isMobile ? { x: 0 } : { opacity: 1, scale: 1, x: 0 }}
              style={{ opacity: isMobile ? mobilePhoneOpacity : 1, scale: isMobile ? mobilePhoneScale : 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={
                isMobile
                  ? `group fixed inset-x-0 top-[4vh] z-30 mx-auto w-[92vw] max-w-[460px] h-[92vh] max-h-[900px] rounded-[52px] overflow-hidden border-[10px] border-[#161619] shadow-[0_12px_30px_rgba(0,0,0,0.7)] bg-zinc-950 ring-1 ring-white/10 transition-all duration-500 ${
                      !isScrolled ? "pointer-events-none" : "pointer-events-auto"
                    }`
                  : "group relative w-full max-w-[380px] xl:max-w-[410px] 2xl:max-w-[440px] shrink-0 h-[calc(100vh-3rem)] max-h-[820px] rounded-[44px] overflow-hidden border-[9px] border-[#161619] shadow-[0_35px_80px_rgba(0,0,0,0.95)] bg-zinc-950 ring-1 ring-white/10 pointer-events-auto"
              }
            >
              {/* Phone Speaker Slit & Interactive Dynamic Island / Notch Accent */}
              <motion.div
                onMouseEnter={() => setIsIslandHovered(true)}
                onMouseLeave={() => setIsIslandHovered(false)}
                animate={{
                  width: showNotification ? 260 : isIslandHovered ? 250 : 132,
                  height: showNotification ? 52 : isIslandHovered ? 46 : 26,
                  borderRadius: showNotification || isIslandHovered ? "26px" : "9999px",
                }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-black z-50 border border-white/10 flex items-center justify-between px-4 shadow-xl cursor-default overflow-hidden pointer-events-auto shadow-black/80 ring-1 ring-white/5"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {showNotification ? (
                    <motion.div
                      key={`notif-${notificationIndex}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28 }}
                      className="w-full flex items-center gap-2.5"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: `${notifications[notificationIndex].tint}22`,
                          boxShadow: `0 0 14px ${notifications[notificationIndex].tint}55`,
                        }}
                      >
                        {(() => {
                          const Ic = notifications[notificationIndex].icon;
                          return <Ic size={14} color={notifications[notificationIndex].tint} />;
                        })()}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 text-left">
                        <span
                          className="text-[8.5px] font-black tracking-widest uppercase leading-none"
                          style={{ color: notifications[notificationIndex].tint }}
                        >
                          {notifications[notificationIndex].title}
                        </span>
                        <span className="text-[9.5px] font-medium text-zinc-200 truncate mt-0.5 leading-tight">
                          {notifications[notificationIndex].body}
                        </span>
                      </div>
                      <span className="text-[7.5px] font-mono text-zinc-500 shrink-0 select-none">
                        à l'instant
                      </span>
                    </motion.div>
                  ) : isIslandHovered ? (
                    <motion.div
                      key="island-live"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex items-center justify-between gap-1.5"
                    >
                      <div className="flex items-center gap-0.5 shrink-0">
                        <div className="w-0.5 h-3 bg-[#10b981] rounded-full animate-bounce [animation-delay:0.1s]" />
                        <div className="w-0.5 h-1.5 bg-[#10b981] rounded-full animate-bounce [animation-delay:0.3s]" />
                        <div className="w-0.5 h-3.5 bg-[#10b981] rounded-full animate-bounce [animation-delay:0.2s]" />
                      </div>
                      <div className="flex flex-col text-left justify-center min-w-0">
                        <span className="text-[8px] font-black tracking-widest text-[#10b981] leading-none uppercase">
                          LIVE EN LIGNE
                        </span>
                        <span className="text-[9px] font-bold text-zinc-100 truncate mt-0.5">
                          {activeProject ? "Marie January" : "Marie Janvier"}
                        </span>
                      </div>
                      <div className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/5 text-[7px] font-black uppercase tracking-wider shrink-0 select-none">
                        Active
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="island-idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 border border-white/5 shrink-0 animate-pulse" />
                      <div className="w-12 h-0.5 bg-zinc-900 rounded-full shrink-0" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-950 border border-emerald-900/40 flex items-center justify-center shrink-0">
                        <div className="w-0.5 h-0.5 rounded-full bg-emerald-400" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>


              {/* 3D Animated Padlock Indicator under Dynamic Island */}
              <div className="absolute top-[38px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none">
                <AnimatePresence mode="wait">
                  {isPhoneLocked ? (
                    <motion.div
                      key="locked-badge"
                      initial={{ opacity: 0, y: -10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <Lock size={11} className="text-white/40 drop-shadow-md" />
                      <span className="text-[7px] font-black tracking-widest text-[#FF4B2B] uppercase">Verrouillé</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unlocked-badge"
                      initial={{ opacity: 0, y: -5, scale: 0.8 }}
                      animate={{ opacity: [0, 1, 1, 0], y: [0, 0, -3, -10], scale: [0.8, 1.1, 1.1, 0.9] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <Unlock size={11} className="text-[#10b981] drop-shadow-[0_0_8px_#10b981]" />
                      <span className="text-[7px] font-black tracking-widest text-[#10b981] uppercase animate-pulse">Déverrouillé</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile UI Status Bar */}
              <div className="absolute top-2 w-full px-6 flex justify-between items-center text-[9px] font-mono text-zinc-400 font-semibold z-50 pointer-events-none select-none lg:pl-6 lg:pr-6 pl-8 pr-8">
                {/* Clock */}
                <div className="text-white/90 font-medium pl-1">
                  {time.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                {/* Phone System Icons */}
                <div className="flex items-center gap-1.5 pr-1">
                  {/* Cellular Signal Icons */}
                  <div className="flex items-end gap-0.5 h-2">
                    <div className="w-0.5 h-1 bg-white/70 rounded-xs" />
                    <div className="w-0.5 h-1.5 bg-white/70 rounded-xs" />
                    <div className="w-0.5 h-2 bg-white/75 rounded-xs" />
                    <div className="w-0.5 h-2.5 bg-white rounded-xs" />
                  </div>
                  {/* Battery Pill */}
                  <div className="flex items-center gap-0.5 border border-white/40 h-2.5 w-5 rounded-xs p-0.5">
                    <div className="h-full w-2.5 bg-emerald-500 rounded-[1px]" />
                    <div className="h-0.5 w-0.5 bg-white/40 rounded-r-xs" />
                  </div>
                </div>
              </div>

              {/* Portrait Image or Active Portfolio Image with Crossfade */}
              <div className={`absolute inset-0 w-full h-full overflow-hidden ${isMobile && !isScrolled ? "hidden" : "block"}`}>
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={phoneImage}
                    src={phoneImage}
                    alt="Marie Janvier"
                    initial={{ opacity: 0, scale: !activeProject ? 1 : 1.10 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: !activeProject ? 1.08 : 0.95 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute inset-0 w-full h-full object-cover scale-102 transition-all duration-1000 ${
                      isMobile && isScrolled
                        ? "grayscale-0 brightness-[0.95]"
                        : "grayscale-0 brightness-[0.9] group-hover:grayscale group-hover:brightness-[0.55]"
                    }`}
                  />
                </AnimatePresence>

                {/* Sweeping biometric active preview scanline */}
                {activeProject && (
                  <motion.div
                    initial={{ y: "-100%" }}
                    animate={{ y: "100vh" }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                    className="absolute inset-x-0 h-44 bg-gradient-to-b from-transparent via-[#10b981]/20 to-transparent pointer-events-none z-15"
                  />
                )}

                {/* Pair hologram flash effect */}
                <AnimatePresence>
                  {activeProject && (
                    <motion.div
                      key="unlock-flash-glow"
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-white/10 mix-blend-overlay z-20 pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Refined Dark Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-95 z-10 ${isMobile && !isScrolled ? "hidden" : "block"}`} />

              {/* Vertical Availability Indicator removed */}

              {/* Top-Right Discreet Social Column */}
              <AnimatePresence>
                {!activeProject && (
                  <motion.div
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ opacity: isMobile ? mobilePhoneDetailsOpacity : 1 }}
                    exit={{ opacity: 0, x: 25 }}
                    transition={{ duration: 0.4 }}
                    className={`absolute right-3 top-20 flex flex-col gap-1.5 z-30 ${isMobile && !isScrolled ? "hidden" : "flex"}`}
                  >
                    {[Facebook, Twitter, Youtube, Linkedin].map((Icon, idx) => (
                      <button
                        key={idx}
                        className="w-5 h-5 rounded-full bg-zinc-950/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-brand-orange hover:border-brand-orange/20 hover:scale-105 transition-all duration-300 pointer-events-auto"
                      >
                        <Icon size={10} />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Card Content */}
              <motion.div
                style={{ opacity: isMobile ? mobilePhoneDetailsOpacity : 1, y: isMobile ? mobilePhoneDetailsY : 0 }}
                className={`absolute bottom-24 left-5 right-5 z-20 ${isMobile && !isScrolled ? "hidden" : "block"}`}
              >
                <AnimatePresence mode="wait">
                  {!activeProject ? (
                    <motion.div
                      key="locked-details"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-3.5"
                    >
                      <div>
                        <span className="text-brand-orange text-[8px] font-mono font-black tracking-widest uppercase block mb-0.5">
                          ● STRATÈGE & OPERATOR PRODUIT
                        </span>
                        <h2 className="text-2xl xl:text-3xl font-black text-white mt-0.5 mb-1.5 leading-none tracking-tight">
                          Marie <br /> Janvier
                        </h2>
                        <p className="text-zinc-400 text-[10px] font-light leading-relaxed max-w-[220px]">
                          Conseil en stratégie produit, direction créative et
                          modélisation de croissance à Abidjan & Dakar.
                        </p>
                      </div>

                      {/* Morphing Buttons Group */}
                      <div className="flex items-center justify-between gap-2.5 pt-1">
                        <div
                          onMouseEnter={() => setIsCollabHovered(true)}
                          onMouseLeave={() => setIsCollabHovered(false)}
                          className="flex items-center relative cursor-pointer select-none shrink-0"
                        >
                          <motion.div
                            animate={{
                              width: isCollabHovered ? "170px" : "152px",
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 25,
                            }}
                            className="relative h-10 rounded-full border border-white/10 flex items-center overflow-hidden px-1 bg-zinc-900/40 backdrop-blur-xl shadow-lg"
                          >
                            {/* Background Morph Shifter */}
                            <motion.div
                              animate={{
                                width: "100%",
                                opacity: isCollabHovered ? 1 : 0,
                                background:
                                  "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                              className="absolute inset-0 z-0 opacity-0"
                            />

                            {/* Green/Cyan circle containing arrow - moves to the right */}
                            <motion.div
                              animate={{
                                x: isCollabHovered ? 122 : 0,
                                backgroundColor: isCollabHovered
                                  ? "#ffffff"
                                  : "#10b981",
                                color: isCollabHovered ? "#059669" : "#0a0a0a",
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 24,
                              }}
                              className="w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10 shrink-0"
                            >
                              <ArrowRight size={14} strokeWidth={2.5} />
                            </motion.div>

                            {/* "Collaborer" text button - moves to the left */}
                            <motion.a
                              href="#contact"
                              animate={{
                                x: isCollabHovered ? -32 : 0,
                                color: isCollabHovered ? "#ffffff" : "#d4d4d8",
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 24,
                              }}
                              className="absolute left-11 select-none font-sans text-[9px] font-black uppercase tracking-widest z-10 block"
                            >
                              Collaborer
                            </motion.a>
                          </motion.div>
                        </div>

                        <button className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest px-1.5 py-1.5 shrink-0">
                          <Download size={11} /> CV
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="unlocked-portfolio"
                      initial={{ opacity: 0, y: 40, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 30, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[#10b981] text-[9px] font-mono font-black tracking-widest uppercase flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-900/30 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping shrink-0" />
                          PROJET DÉVERROUILLÉ
                        </span>
                        <span className="text-[9.5px] font-bold font-mono tracking-widest uppercase text-white/50 bg-black/40 border border-white/5 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                          {activeProject.year}
                        </span>
                      </div>

                      <div className="border-t border-white/5 pt-3.5">
                        <h3 className="text-brand-orange text-[10px] font-bold tracking-widest uppercase mb-1 font-mono">
                          MARIE JANUARY
                        </h3>
                        <h2 className="text-2xl xl:text-3xl font-black text-white leading-tight tracking-tight uppercase">
                          {activeProject.title}
                        </h2>
                        <div className="text-[10px] uppercase font-black tracking-widest text-[#10b981] mt-1.5">
                          {activeProject.category}
                        </div>
                      </div>

                      <p className="text-zinc-300 text-[10.5px] font-light leading-relaxed">
                        {projectDescriptions[activeProject.id] || "Création graphique de pointe, direction artistique stratégique et exécution épurée pour cette réalisation sélectionnée."}
                      </p>

                      {/* Interactive cast indicator badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-950/85 border border-white/10 rounded-2xl p-2.5 flex items-center justify-between backdrop-blur-xl mt-1 shadow-inner"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-[#10b981]/15 border border-[#10b981]/25 flex items-center justify-center text-[#10b981] shrink-0 animate-pulse">
                            <span className="text-[10px] font-mono font-black">MJ</span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[7.5px] text-zinc-500 font-mono block leading-none uppercase">PORTFOLIO SYNCHRONE</span>
                            <span className="text-[9px] text-[#10b981] font-bold block truncate mt-0.5 uppercase tracking-tight">
                              Affichage Actif
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                          <span className="text-[8px] font-bold text-[#10b981] tracking-widest uppercase font-mono">OUVERT</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Swipe to Home Bottom Gesture Bar */}
                <div className="pt-3.5 flex justify-center">
                  <div className="w-16 h-0.5 bg-white/20 rounded-full cursor-grab active:bg-white/40 active:w-20 transition-all pointer-events-auto" />
                </div>
              </motion.div>

              {/* Desktop dock + immersive screens — mirrors mobile behaviour inside the phone frame */}
              <div className="hidden lg:block absolute inset-0 z-40 pointer-events-none">
                {dockOverlay}
              </div>
            </motion.div>
          </div>

          {/* Mobile: spacer to preserve document scroll height */}
          {isMobile && <div aria-hidden style={{ height: streamHeight }} />}

          {/* Right Column: Scrollable Content Stream */}
          <div
            className={
              isMobile
                ? "fixed inset-x-0 top-[4vh] z-[45] mx-auto h-[92vh] max-h-[900px] w-[92vw] max-w-[460px] overflow-hidden rounded-[52px] border-[10px] border-transparent box-border pointer-events-none lg:static lg:h-auto lg:max-h-none lg:w-auto lg:max-w-none lg:overflow-visible lg:rounded-none lg:border-0"
                : "contents"
            }
          >
          <motion.div
            ref={streamInnerRef}
            data-mobile-stream-inner
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              opacity: isMobile ? mobileStreamOpacity : 1,
              y: isMobile ? mobileStreamTranslateY : 0,
            }}
            className={`flex flex-col gap-10 lg:gap-32 py-4 lg:py-6 relative z-40 w-full max-w-[500px] lg:max-w-none min-w-0 mx-auto px-8 sm:px-10 lg:pl-0 lg:pr-4 pt-[106vh] pb-16 lg:pb-32 lg:pt-2 transition-opacity duration-500 ${
              isMobile && !isScrolled ? "pointer-events-none" : "pointer-events-auto"
            }`}
          >
            {/* Stream Part 1: Hero Welcome & Identity */}
            <motion.div
              onViewportEnter={() => {
                handleSelectProject(null);
                setActiveSection("home");
              }}
              className="space-y-12"
            >
              {/* Location & Time Row */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center gap-3 lg:flex-row lg:items-start lg:justify-between border-b border-white/5 pb-8"
              >
                <div className="flex items-center gap-3">
                  <a href="#" className="block">
                    <img src={mjkLogo} alt="Marie Janvier Kitcho" className="h-14 lg:h-20 w-auto" />
                  </a>
                </div>


                <div className="text-right hidden sm:block">
                  <div className="text-white/30 text-[9px] font-black uppercase tracking-wider mb-0.5">
                    {time.toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                  <div className="text-lg font-mono font-medium text-white/80 leading-none">
                    {time.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Headline */}
              <div className="space-y-6 max-w-3xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-zinc-100 leading-[1.1] tracking-tight text-balance select-none">
                  <div className="overflow-hidden">
                    <motion.div
                      initial={{ y: "115%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                    >
                      Bâtir des{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-[#FFC4B0]">
                        stratégies
                      </span>{" "}
                      et des produits qui marquent les esprits.
                    </motion.div>
                  </div>
                </h1>

                <div className="overflow-hidden">
                  <motion.p
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                    className="text-zinc-400 text-base md:text-lg font-light leading-relaxed max-w-2xl"
                  >
                    Je combine expertise opérationnelle, branding haut de gamme et
                    ingénierie produit pour matérialiser des visions ambitieuses
                    et propulser vos projets vers le succès.
                  </motion.p>
                </div>
              </div>

              {/* Stats Grid */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-10 border-t border-white/5 pt-10 max-w-lg"
              >
                <div>
                  <div className="text-4xl lg:text-5xl font-display font-black text-white tracking-tighter">
                    10+
                  </div>
                  <div className="text-white/30 text-[9px] font-black uppercase tracking-widest mt-1">
                    Ans d'expérience
                  </div>
                </div>

                <div>
                  <div className="text-4xl lg:text-5xl font-display font-black text-white tracking-tighter italic">
                    50+
                  </div>
                  <div className="text-white/30 text-[9px] font-black uppercase tracking-widest mt-1">
                    Lancements réussis
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Stream Part 2: About with clip-path screen wipe reveal */}
            <motion.div
              onViewportEnter={() => {
                handleSelectProject(null);
                setActiveSection("about");
              }}
              id="about"
              className="space-y-8 border-t border-white/5 pt-6 lg:pt-16 scroll-mt-24"
            >
              {/* Sleek display title with elegant clip-path swipe */}
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
                  whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-2xl md:text-5xl font-normal text-white leading-tight tracking-tight max-w-3xl"
                >
                  Concevoir des marques et des produits avec clarté, créativité et
                  rigeur stratégique.
                </motion.h2>
              </div>


              {/* Extremely soft clean manifesto text */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="text-zinc-400 text-lg font-light leading-relaxed max-w-3xl"
              >
                Je combine stratégie produit, design d'identité et efficacité
                technologique pour aider les entreprises à se développer
                rapidement tout en restant fidèles à leur essence. Chaque projet
                est abordé sous l'angle du style et de l'impact opérationnel —
                pour s'assurer que le design ne soit pas seulement beau, mais
                utile, durable et performant.
              </motion.p>
            </motion.div>

            {/* Stream Part 3: Discreet Integrated Clients with continuous horizontal marquee */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              onViewportEnter={() => {
                handleSelectProject(null);
                setActiveSection("about");
              }}
              className="hidden md:block border-t border-white/5 pt-12 space-y-6"
            >
              <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest">
                <Globe size={12} className="text-brand-orange" />
                <span>Nos clients & partenaires (2015-26©)</span>
              </div>

              {/* Infinite Horizontal Logo Marquee Slider */}
              <div className="relative w-full overflow-hidden bg-zinc-950/20 border border-white/5 py-7 px-1 rounded-2xl [mask-image:linear-gradient(to_right,transparent_0,black_64px,black_calc(100%-64px),transparent_100%)] select-none">
                <motion.div
                  animate={{ x: [0, "-50%"] }}
                  transition={{
                    ease: "linear",
                    duration: 22,
                    repeat: Infinity,
                  }}
                  className="flex gap-16 items-center w-[200%] shrink-0"
                >
                  {/* First Logo Iteration */}
                  <div className="flex gap-16 items-center shrink-0">
                    {/* Adidas */}
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[18px] text-white/50 fill-current hover:text-white hover:scale-105 transition-all duration-305"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.38 21.01h2.51l5.25-9.1h-2.51l-5.25 9.1zm4.72 0h2.51l5.24-9.1h-2.51l-5.24 9.1zm4.72 0h2.51l5.25-9.1h-2.51l-5.25 9.1z" />
                    </svg>

                    {/* Apple */}
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[18px] text-white/50 fill-current hover:text-white hover:scale-105 transition-all duration-305"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.7-.34-1.42-.36-2.14 0-1.09.52-1.95.42-2.88-.47C4.69 16.04 4.3 9.4 8.24 9.17c1.32.08 2.18.73 2.92.73.74 0 1.84-.78 3.32-.63 1.57.17 2.76.84 3.42 1.85-3.14 1.88-2.61 6.02.6 7.32-.7 1.76-1.47 3.52-2.45 3.84zM15.03 6.05c1.17-1.42.92-3.13.82-3.95-.91.08-2.1.62-2.76 1.43-1.02 1.14-.85 2.87-.75 3.65.98.07 1.94-.48 2.69-1.13z" />
                    </svg>

                    {/* Microsoft */}
                    <svg
                      viewBox="0 0 23 23"
                      className="h-4 text-white/50 fill-current hover:text-white hover:scale-105 transition-all duration-305"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
                    </svg>

                    {/* Nike */}
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[13px] text-white/50 fill-current hover:text-white hover:scale-105 transition-all duration-305"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M23.99 7.07c-.42 1.34-1.41 2.82-2.92 4.37-2.69 2.75-6.68 5.66-11.78 8.62-2.07 1.2-3.8 1.94-5.12 1.94-.74 0-1.27-.42-1.24-1.26.04-1.11 1-3.6 2.84-7.36 1.1-2.22 2.05-3.83 2.85-4.79.52-.63 1.05-.95 1.58-.95.4 0 .61.21.61.63s-.46 1.62-1.37 3.62c-.81 1.78-1.23 2.86-1.23 3.2 0 .52.37.78 1.11.78.36 0 1.07-.22 2.1-.64 4.36-1.78 8.94-4.82 13.56-9.1 1.28-1.16 2.5-2.07 3.5-2.07.3 0 .56.12.76.36.26.27.34.61.26 1z" />
                    </svg>

                    {/* Logoipsum */}
                    <svg
                      viewBox="0 0 144 32"
                      className="h-4 text-white/50 fill-current hover:text-white hover:scale-105 transition-all duration-305"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.4 8h-4.8v16h4.8c4.2 0 7.6-3.4 7.6-8s-3.4-8-7.6-8zm-1.8 12.8v-9.6h1.8c2.4 0 4.2 1.8 4.2 4.8s-1.8 4.8-4.2 4.8h-1.8zm24-12.8h-9.2v16h9.2v-3.2h-6v-3.2h5.4v-3.2h-5.4v-3.2h6V8zm16.8 6c0-3.3-2.7-6-6-6-3.3 0-6 2.7-6 6v4c0 3.3 2.7 6 6 6s6-2.7 6-6V14zm-3.2 4c0 1.5-1.2 2.8-2.8 2.8s-2.8-1.3-2.8-2.8v-4c0-1.5 1.2-2.8 2.8-2.8s2.8 1.3 2.8 2.8v4zm25.2-10h-3.2l-3.2 6.4-3.2-6.4H74l4.8 9.6v6.4h3.2v-6.4l4.8-9.6zm16.4 12.8c-2.4 0-4.2-1.8-4.2-4.8V14c0-3 1.8-4.8 4.2-4.8h6v-3.2h-6C103.4 6 100 9.4 100 13.6v4.8c0 4.2 3.4 7.6 7.6 7.6h6v-3.2h-6zm19.2 3.2h3.2V8h-3.2v16zm12.4-16h-4.8v16h4.8c4.2 0 7.6-3.4 7.6-8s-3.4-8-7.6-8zm-1.8 12.8v-9.6h1.8c2.4 0 4.2 1.8 4.2 4.8s-1.8 4.8-4.2 4.8h-1.8z" />
                    </svg>
                  </div>

                  {/* Second Loop iteration for infinite seamless wrap */}
                  <div className="flex gap-16 items-center shrink-0" aria-hidden="true">
                    {/* Adidas */}
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[18px] text-white/50 fill-current hover:text-white hover:scale-105 transition-all duration-305"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2.38 21.01h2.51l5.25-9.1h-2.51l-5.25 9.1zm4.72 0h2.51l5.24-9.1h-2.51l-5.24 9.1zm4.72 0h2.51l5.25-9.1h-2.51l-5.25 9.1z" />
                    </svg>

                    {/* Apple */}
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[18px] text-white/50 fill-current hover:text-white hover:scale-105 transition-all duration-305"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.7-.34-1.42-.36-2.14 0-1.09.52-1.95.42-2.88-.47C4.69 16.04 4.3 9.4 8.24 9.17c1.32.08 2.18.73 2.92.73.74 0 1.84-.78 3.32-.63 1.57.17 2.76.84 3.42 1.85-3.14 1.88-2.61 6.02.6 7.32-.7 1.76-1.47 3.52-2.45 3.84zM15.03 6.05c1.17-1.42.92-3.13.82-3.95-.91.08-2.1.62-2.76 1.43-1.02 1.14-.85 2.87-.75 3.65.98.07 1.94-.48 2.69-1.13z" />
                    </svg>

                    {/* Microsoft */}
                    <svg
                      viewBox="0 0 23 23"
                      className="h-4 text-white/50 fill-current hover:text-white hover:scale-105 transition-all duration-305"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
                    </svg>

                    {/* Nike */}
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[13px] text-white/50 fill-current hover:text-white hover:scale-105 transition-all duration-305"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M23.99 7.07c-.42 1.34-1.41 2.82-2.92 4.37-2.69 2.75-6.68 5.66-11.78 8.62-2.07 1.2-3.8 1.94-5.12 1.94-.74 0-1.27-.42-1.24-1.26.04-1.11 1-3.6 2.84-7.36 1.1-2.22 2.05-3.83 2.85-4.79.52-.63 1.05-.95 1.58-.95.4 0 .61.21.61.63s-.46 1.62-1.37 3.62c-.81 1.78-1.23 2.86-1.23 3.2 0 .52.37.78 1.11.78.36 0 1.07-.22 2.1-.64 4.36-1.78 8.94-4.82 13.56-9.1 1.28-1.16 2.5-2.07 3.5-2.07a1.05 1.05 0 0 1 .76.36c.26.27.34.61.26 1z" />
                    </svg>

                    {/* Logoipsum */}
                    <svg
                      viewBox="0 0 144 32"
                      className="h-4 text-white/50 fill-current hover:text-white hover:scale-105 transition-all duration-305"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12.4 8h-4.8v16h4.8c4.2 0 7.6-3.4 7.6-8s-3.4-8-7.6-8zm-1.8 12.8v-9.6h1.8c2.4 0 4.2 1.8 4.2 4.8s-1.8 4.8-4.2 4.8h-1.8zm24-12.8h-9.2v16h9.2v-3.2h-6v-3.2h5.4v-3.2h-5.4v-3.2h6V8zm16.8 6c0-3.3-2.7-6-6-6-3.3 0-6 2.7-6 6v4c0 3.3 2.7 6 6 6s6-2.7 6-6V14zm-3.2 4c0 1.5-1.2 2.8-2.8 2.8s-2.8-1.3-2.8-2.8v-4c0-1.5 1.2-2.8 2.8-2.8s2.8 1.3 2.8 2.8v4zm25.2-10h-3.2l-3.2 6.4-3.2-6.4H74l4.8 9.6v6.4h3.2v-6.4l4.8-9.6zm16.4 12.8c-2.4 0-4.2-1.8-4.2-4.8V14c0-3 1.8-4.8 4.2-4.8h6v-3.2h-6C103.4 6 100 9.4 100 13.6v4.8c0 4.2 3.4 7.6 7.6 7.6h6v-3.2h-6zm19.2 3.2h3.2V8h-3.2v16zm12.4-16h-4.8v16h4.8c4.2 0 7.6-3.4 7.6-8s-3.4-8-7.6-8zm-1.8 12.8v-9.6h1.8c2.4 0 4.2 1.8 4.2 4.8s-1.8 4.8-4.2 4.8h-1.8z" />
                    </svg>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Stream Part 4: Parcours (Expériences & Formation) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => {
                handleSelectProject(null);
                setActiveSection("parcours");
              }}
              id="parcours"
              transition={{ duration: 0.8 }}
              className="border-t border-white/5 pt-6 lg:pt-16 space-y-8 lg:space-y-12 scroll-mt-24"
            >
              <div>
                <BlurFade y={12} duration={0.7}>
                  <div className="text-xs font-black uppercase tracking-[0.5em] hero-text-gradient mb-4">
                    Expérience & Formation
                  </div>
                </BlurFade>
                <WordStagger
                  as="h2"
                  text="Parcours Achieved"
                  className="text-3xl md:text-5xl font-black uppercase tracking-normal leading-none text-white"
                  stagger={0.08}
                />
              </div>

              <StaggerList className="relative divide-y divide-white/5" stagger={0.12}>
                {combinedData.map((item, idx) => (
                  <motion.div key={item.id} variants={staggerItem}>
                    <ParcoursItem
                      index={idx}
                      year={
                        item.date.split(" — ")[0].replace(/\D/g, "") || item.date
                      }
                      subtitle={item.location}
                      title={item.title}
                      description={item.description}
                    />
                  </motion.div>
                ))}
              </StaggerList>
            </motion.div>

            {/* Univers Visuel section removed per request */}

            {/* Stream Part 6: Tools & Expertise Section */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => {
                handleSelectProject(null);
                setActiveSection("expertise");
              }}
              id="expertise"
              transition={{ duration: 0.8 }}
              className="border-t border-white/5 pt-6 lg:pt-16 space-y-8 lg:space-y-12 scroll-mt-24"
            >
              <div className="space-y-4">
                <MaskReveal as="div" className="max-w-2xl" duration={1.1}>
                  <h3 className="text-xl md:text-4xl font-normal text-white leading-tight tracking-normal">
                    See how my expertise with these tools drives better results
                  </h3>
                </MaskReveal>
              </div>


              {/* Tools row lists */}
              <div className="divide-y divide-white/5 pt-4">
                {toolsData.map((tool, idx) => (
                  <ToolsRow
                    key={tool.name}
                    name={tool.name}
                    description={tool.description}
                    percentage={tool.percentage}
                    icon={tool.icon}
                    index={idx}
                  />
                ))}
              </div>
            </motion.div>

            {/* Stream Part 7: Champ d'action (ExpertiseSection) */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => {
                setActiveSection("expertise");
              }}
              transition={{ duration: 0.8 }}
              className="border-t border-white/5 pt-6 lg:pt-16 space-y-12"
            >
              <div className="space-y-3">
                <h3 className="text-xl md:text-4xl font-normal text-white leading-tight tracking-normal max-w-2xl">
                  Un profil hybride à l'écoute de vos ambitions stratégiques
                </h3>
              </div>


              {(() => {
                const cardMeta = [
                  { icon: Layers,           accent: "rgba(167,139,250,0.55)" },
                  { icon: Palette,          accent: "rgba(244,114,182,0.55)" },
                  { icon: TrendingUp,       accent: "rgba(52,211,153,0.55)"  },
                  { icon: Settings,         accent: "rgba(96,165,250,0.55)"  },
                  { icon: UtensilsCrossed,  accent: "rgba(251,191,36,0.55)"  },
                  { icon: Printer,          accent: "rgba(255,107,71,0.55)"  },
                ];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                    {expertise.map((item, i) => {
                      const meta = cardMeta[i % cardMeta.length];
                      return (
                        <ExpertiseCard
                          key={item.id}
                          item={item}
                          index={i}
                          meta={meta}
                        />
                      );
                    })}
                  </div>
                );
              })()}
            </motion.div>

            {/* Stream Part 8: Approche & Vision (VisionSection) */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => {
                setActiveSection("expertise");
              }}
              transition={{ duration: 0.8 }}
              className="border-t border-white/5 pt-6 lg:pt-16 space-y-12"
            >
              <div className="space-y-4">
                <h3 className="text-xl md:text-4xl font-normal text-white leading-tight tracking-normal max-w-2xl">
                  Concevoir avec clarté, rigueur et engagement opérationnel
                </h3>
              </div>


              {/* 3D perspective fold container */}
              <div className="grid grid-cols-1 gap-6 pt-4 [perspective:1000px]">
                {visionCards.map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, rotateX: 25, y: 45, scale: 0.96 }}
                    whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      type: "spring",
                      stiffness: 85,
                      damping: 16,
                      delay: idx * 0.12 
                    }}
                    className="bg-zinc-950 border border-white/5 p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
                  >
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-6">
                      <div className="p-4 rounded-2xl bg-brand-orange/10 w-fit shrink-0">
                        {card.icon}
                      </div>

                      <div className="space-y-3">
                        <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                          {card.title}
                        </span>
                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-normal leading-none text-white">
                          {card.subtitle}
                        </h3>
                        <p className="text-sm leading-relaxed font-light text-zinc-400">
                          {card.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>





            {/* Stream Part 9: Voix Élogieuses (TestimonialsSection) */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => {
                setActiveSection("expertise");
              }}
              transition={{ duration: 0.8 }}
              className="border-t border-white/5 pt-6 lg:pt-16 space-y-8 lg:space-y-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl md:text-4xl font-normal text-white leading-tight tracking-normal max-w-xl">
                    La voix de ceux qui font confiance à notre rigueur
                  </h3>
                </div>


                {/* Client selector tabs - Compact & Sleek */}
                <div className="flex flex-wrap gap-2">
                  {testimonialsData.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`text-[9px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl border transition-all duration-300 relative ${
                        activeTestimonial === idx
                          ? "bg-brand-orange text-white border-brand-orange/20 shadow-lg shadow-brand-orange/20 scale-102 font-bold"
                          : "bg-zinc-900/60 text-zinc-400 border-white/5 hover:text-white hover:border-white/10"
                      }`}
                    >
                      {t.logo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stacked cards reveal (scroll-driven) — dark DA */}
              <ContainerScroll className="!min-h-[300vh] lg:!min-h-[220vh]">
                <CardsContainer>
                  {testimonialsData.map((t, idx) => (
                    <CardTransformed
                      key={t.id}
                      variant="dark"
                      arrayLength={testimonialsData.length}
                      index={idx}
                      incrementY={6}
                      incrementZ={8}
                      className="!justify-between !gap-4 !p-5 sm:!p-6 md:!p-8 lg:!p-10 !rounded-[1.5rem] lg:!rounded-[2rem] !bg-zinc-950/90 !border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
                    >
                      <div className="w-full space-y-4 lg:space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono tracking-widest text-emerald-400/80 uppercase font-bold">
                            {t.logo}
                          </span>
                          <span className="font-serif text-white/10 text-5xl lg:text-6xl leading-none select-none">
                            “
                          </span>
                        </div>
                        <p className="text-white text-[17px] sm:text-lg md:text-xl font-light leading-relaxed italic">
                          “{t.quote}”
                        </p>
                      </div>
                      <div className="w-full flex items-center gap-3 lg:gap-4 pt-4 lg:pt-6 border-t border-white/5">
                        <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full overflow-hidden border border-white/10 shrink-0">
                          <img
                            src={t.avatar}
                            alt={t.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-black text-sm tracking-tight">
                            {t.author}
                          </div>
                          <div className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-0.5">
                            {t.role}
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-600 tabular-nums">
                          {String(idx + 1).padStart(2, "0")} / {String(testimonialsData.length).padStart(2, "0")}
                        </div>
                      </div>
                    </CardTransformed>
                  ))}
                </CardsContainer>
              </ContainerScroll>

            </motion.div>




            {/* Stream Part 10: Statistiques & Impact (StatsSection) */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              onViewportEnter={() => {
                setActiveSection("expertise");
              }}
              transition={{ duration: 0.8 }}
              className="border-t border-white/5 pt-6 lg:pt-16 space-y-12"
            >
              <div className="space-y-4">
                <h3 className="text-xl md:text-4xl font-normal text-white leading-tight tracking-normal max-w-2xl">
                  Une trajectoire d'excellence dictée par des livrables concrets
                </h3>
              </div>


              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4">
                {statistics.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      type: "spring",
                      stiffness: 90,
                      damping: 15,
                      delay: idx * 0.1 
                    }}
                    className="bg-zinc-950/60 p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-md flex flex-col justify-between relative overflow-hidden group hover:border-white/10 hover:shadow-lg hover:shadow-white/[0.01] transition-all duration-300"
                  >
                    {/* Laser sweep overlay effect */}
                    <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:left-[150%] transition-all duration-1000 pointer-events-none" />
                    <div>
                      <div className="text-3xl sm:text-4xl font-black text-white tracking-tighter hero-text-gradient mb-2">
                        {stat.value}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest font-mono text-zinc-500 font-black mb-3">
                        {stat.label}
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                      {stat.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stream Part 11: Call to Action (CtaBanner) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              onViewportEnter={() => {
                handleSelectProject(null);
                setActiveSection("contact");
              }}
              transition={{ duration: 0.8 }}
              className="mt-8"
            >
              <div className="bg-gradient-to-tr from-brand-orange/20 via-zinc-950 to-zinc-950 border border-white/5 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden text-center">
                {/* Abstract Ambient Glow */}
                <div className="absolute top-0 right-0 w-60 h-60 bg-brand-orange/15 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-xl mx-auto space-y-6">
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                    <MessageSquare className="w-3.5 h-3.5 text-brand-orange" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
                      Discutons de vos besoins
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-normal uppercase">
                    Transformez votre <br />
                    <span className="hero-text-gradient">
                      vision en réalité.
                    </span>
                  </h3>

                  <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-md mx-auto">
                    Du concept à l'exécution terrain, nous bâtissons des
                    produits à forte valeur ajoutée.
                  </p>

                  <div className="pt-4 flex justify-center">
                    <motion.a
                      href="#contact"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="group relative inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:bg-neutral-100"
                    >
                      Démarrer un projet
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          </div>

        </div>
      </div>


      {/* Full-screen high-quality project Image Lightbox viewer */}
      <ImageViewer
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      {/* Immersive Gallery Modal — opened from dock */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-black/90 to-transparent">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/80 mb-1">
                  Galerie immersive
                </div>
                <h2 className="text-lg font-bold text-white">Mes réalisations</h2>
              </div>
              <button
                onClick={() => setGalleryOpen(false)}
                aria-label="Fermer la galerie"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 p-1 pb-24">
              {projects.map((p, i) => (
                <motion.button
                  key={p.id ?? i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setSelectedImage(PLACEHOLDER_IMG)}
                  className="relative aspect-square overflow-hidden group bg-zinc-900"
                >
                  <img
                    src={PLACEHOLDER_IMG}
                    alt={p.title || `Projet ${i + 1}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-active:scale-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 left-2 right-2 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 truncate">
                    {p.title}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Mobile locked state screen overlay with dynamic animation */}
      <AnimatePresence>
        {isMobile && !isScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-40 flex flex-col items-center justify-center pointer-events-none select-none"
          >
            <motion.div
              initial={{ y: 35, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0, y: -35 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center px-6"
            >
              <img
                src={mjkLogo}
                alt="Marie Janvier Kitcho"
                className="h-28 sm:h-36 w-auto mb-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.08)]"
              />
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-100 mb-4 leading-tight">
                Bienvenue dans mon univers
              </h1>
              <p className="text-sm sm:text-base font-light text-neutral-400 max-w-xs leading-relaxed mb-8">
                Faites défiler — chaque geste révèle un fragment de ma vision.
              </p>
              <div className="w-[1px] h-24 bg-gradient-to-b from-neutral-400 via-neutral-400/40 to-transparent mx-auto" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
