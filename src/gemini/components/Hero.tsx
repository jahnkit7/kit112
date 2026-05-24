import { useRef, useState, useEffect, ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
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
void PARCOURS_EASE;


// Inline SVG placeholder kept for legacy modal grids (zero network cost).
const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'><rect width='4' height='3' fill='%23222'/><text x='2' y='1.7' font-family='monospace' font-size='0.35' fill='%23666' text-anchor='middle'>placeholder</text></svg>";

// Real images via Unsplash CDN (lightweight, on-demand resized, no bundle weight).
const PARCOURS_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=480&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&q=70&auto=format&fit=crop",
];

interface ParcoursItemProps {
  title: string;
  subtitle: string;
  description: string;
  year: string;
  index: number;
}

// Single image card with auto horizontal slide between 4 images.
const AutoSlideCard = ({ images, label }: { images: string[]; label: string }) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setActive((v) => (v + 1) % images.length),
      3800,
    );
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
      <AnimatePresence initial={false} mode="sync">
        <motion.img
          key={active}
          src={images[active]}
          alt={`${label} ${active + 1}`}
          loading="lazy"
          decoding="async"
          initial={{ x: "100%", opacity: 0.4 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.18em] text-white/90 drop-shadow">
          {label}
        </span>
        <div className="flex gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1 w-3 rounded-full transition-all ${i === active ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ParcoursItem = ({
  title,
  subtitle,
  description,
  year,
  index,
}: ParcoursItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Scroll-driven scale: small when entering/leaving, full at center (mobile-first).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.88, 1, 1, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.35, 1, 1, 0.35]);

  const images = Array.from(
    { length: 4 },
    (_, i) => PARCOURS_IMAGE_POOL[(index * 4 + i) % PARCOURS_IMAGE_POOL.length],
  );

  const label = title.split("·").pop()?.trim() || "Projet";
  const titleParts = title.split("·");

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      transition={{ layout: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
      layout
      className="py-8 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start"
    >
      <motion.div layout className="md:col-span-9 order-2 md:order-1 space-y-3 md:space-y-4">
        <span className="block text-lg md:text-2xl font-black font-sans tracking-tight text-white">
          {year}
        </span>

        <AnimatePresence mode="wait" initial={false}>
          {!expanded ? (
            <motion.div
              key="collapsed"
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <div className="text-[9px] md:text-xs font-bold tracking-[0.3em] text-white/40 uppercase">
                {subtitle}
              </div>
              <h3 className="text-base md:text-3xl font-black leading-[1.15] tracking-tight text-white">
                {titleParts.map((part, i) => (
                  <span key={i} className={i === 1 ? "text-white/30 block md:inline" : ""}>
                    {i === 1 ? ` for ${part.trim()}` : part.trim()}
                  </span>
                ))}
              </h3>
              <p className="text-[13px] md:text-base font-light max-w-2xl leading-relaxed text-white/50">
                {description}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur-sm"
            >
              <div className="text-[9px] md:text-xs font-bold tracking-[0.3em] text-primary uppercase">
                {subtitle} — Détails
              </div>
              <h3 className="text-lg md:text-3xl font-black leading-[1.1] tracking-tight text-white">
                {title}
              </h3>
              <p className="text-sm md:text-base font-light leading-relaxed text-white/80">
                {description}
              </p>
              <p className="text-sm md:text-base font-light leading-relaxed text-white/60">
                Plus de détails, captures et explorations visuelles à venir
                pour ce projet. Cette expérience a marqué une étape clé du
                parcours : structuration, mise en marché et exécution terrain.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {images.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-zinc-900"
                  >
                    <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="group inline-flex items-center gap-1.5 pt-1 text-[10px] md:text-[11px] font-black uppercase tracking-[0.18em] text-white/70 transition hover:text-white"
        >
          {expanded ? "Réduire" : "Plus d'infos"}
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown size={12} />
          </motion.span>
        </button>
      </motion.div>

      <motion.div layout className="md:col-span-3 order-1 md:order-2">
        <AutoSlideCard images={images} label={label} />
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
  const Icon = meta.icon;

  const cardShell = (
    <div
      className="absolute inset-0 overflow-hidden rounded-[1.75rem] border bg-gradient-to-b from-zinc-950 via-black to-black"
      style={{ borderColor: "rgba(255,255,255,0.1)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/32 to-black/70" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 100%, black 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 100%, black 0%, transparent 75%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-12 h-48 w-48 rounded-full opacity-25"
        style={{ background: meta.accent }}
      />
      <span
        className="pointer-events-none absolute -top-6 -right-2 select-none font-display text-[8rem] font-black leading-none tracking-tighter text-white/[0.06]"
        aria-hidden
      >
        {item.id}
      </span>
      <div
        className="pointer-events-none absolute inset-x-6 bottom-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(to right, transparent, ${meta.accent}, transparent)` }}
      />
    </div>
  );

  const cardContent = (
    <div className="pointer-events-none absolute inset-0 z-10 flex min-h-[320px] flex-col p-7 md:p-8">
      <div className="mb-10 flex items-start justify-between">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-2xl opacity-25"
            style={{ background: meta.accent }}
          />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/45">
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

  return (
    <article className="group relative h-full min-h-[320px]">
      {cardShell}
      {cardContent}
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
    avatar: PLACEHOLDER_IMG,
    logo: "PROJET ODAXIA",
  },
  {
    id: 2,
    quote:
      "GoteaT est la preuve vivante qu'un concept bien designé et rigoureusement exécuté peut s'imposer sur le marché dakarois.",
    author: "Amadou B.",
    role: "Partenaire Stratégique",
    avatar: PLACEHOLDER_IMG,
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
    avatar: PLACEHOLDER_IMG,
    logo: "BRAND OPS",
  },
  {
    id: 5,
    quote:
      "Marie a transformé une idée dispersée en expérience cohérente, désirable et prête à être lancée sans perdre notre exigence business.",
    author: "Karim S.",
    role: "CEO Studio Digital",
    avatar: PLACEHOLDER_IMG,
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
    if (isMobile) {
      setShowNotification(false);
      return;
    }

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
  }, [isMobile, notifications.length]);


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

  const itemVariants: Variants = {
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
                  ? `mobile-phone-shell group fixed inset-x-0 top-[4vh] z-30 mx-auto w-[92vw] max-w-[460px] h-[92vh] max-h-[900px] rounded-[52px] overflow-hidden border-[10px] border-[#161619] bg-zinc-950 transition-opacity duration-300 ${
                      !isScrolled ? "pointer-events-none" : "pointer-events-auto"
                    }`
                  : "group relative w-full max-w-[380px] xl:max-w-[410px] 2xl:max-w-[440px] shrink-0 h-[calc(100vh-3rem)] max-h-[820px] rounded-[44px] overflow-hidden border-[9px] border-[#161619] shadow-[0_35px_80px_rgba(0,0,0,0.95)] bg-zinc-950 ring-1 ring-white/10 pointer-events-auto"
              }
            >
              {/* Phone Speaker Slit & Interactive Dynamic Island / Notch Accent */}
              <motion.div
                onMouseEnter={() => setIsIslandHovered(true)}
                onMouseLeave={() => setIsIslandHovered(false)}
                animate={
                  isMobile
                    ? { width: 132, height: 26, borderRadius: "9999px" }
                    : {
                        width: showNotification ? 260 : isIslandHovered ? 250 : 132,
                        height: showNotification ? 52 : isIslandHovered ? 46 : 26,
                        borderRadius: showNotification || isIslandHovered ? "26px" : "9999px",
                      }
                }
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
                {activeProject && !isMobile && (
                  <motion.div
                    initial={{ y: "-100%" }}
                    animate={{ y: "100vh" }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                    className="absolute inset-x-0 h-44 bg-gradient-to-b from-transparent via-[#10b981]/20 to-transparent pointer-events-none z-15"
                  />
                )}

                {/* Pair hologram flash effect */}
                <AnimatePresence>
                  {activeProject && !isMobile && (
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

              {/* Refined Dark Gradient Overlay — uniform veil for legibility + bottom darkening */}
              <div className={`absolute inset-0 z-10 ${isMobile && !isScrolled ? "hidden" : "block"}`}>
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15" />
              </div>

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
                    className={`absolute right-3 top-20 hidden flex-col gap-1.5 z-30 lg:flex`}
                  >
                    {[Facebook, Twitter, Youtube, Linkedin].map((Icon, idx) => (
                      <button
                        key={idx}
                        className="w-5 h-5 rounded-full bg-zinc-950/90 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-brand-orange hover:border-brand-orange/20 hover:scale-105 transition-all duration-300 pointer-events-auto"
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
                            className="relative h-10 rounded-full border border-white/10 flex items-center overflow-hidden px-1 bg-zinc-900/80 lg:bg-zinc-900/40 lg:backdrop-blur-xl shadow-lg"
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
                        <span className="text-[9.5px] font-bold font-mono tracking-widest uppercase text-white/50 bg-black/70 border border-white/5 px-2.5 py-0.5 rounded-full">
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
                        className="bg-zinc-950/90 border border-white/10 rounded-2xl p-2.5 flex items-center justify-between lg:backdrop-blur-xl mt-1 shadow-inner"
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

              {/* Dock-only render kept inside the phone shell for desktop (relative positioning). */}
              {!isMobile && (
                <div className="absolute inset-0 z-40 pointer-events-none">
                  {dockOverlay}
                </div>
              )}
            </motion.div>

            {/* Mobile dock — rendered OUTSIDE the phone shell so its z-[60] stays above
                the scrolling stream frame (z-45). Otherwise the phone's z-30 stacking
                context would trap the dock underneath the scrolling content. */}
            {isMobile && (
              <div className="fixed inset-x-0 top-[4vh] z-[60] mx-auto h-[92vh] max-h-[900px] w-[92vw] max-w-[460px] pointer-events-none">
                {dockOverlay}
              </div>
            )}
          </div>

          {/* Mobile: spacer to preserve document scroll height */}
          {isMobile && <div aria-hidden style={{ height: streamHeight }} />}

          {/* Right Column: Scrollable Content Stream */}
          <div
            className={
              isMobile
                ? "mobile-stream-frame fixed inset-x-0 top-[4vh] z-[45] mx-auto h-[92vh] max-h-[900px] w-[92vw] max-w-[460px] overflow-hidden rounded-[52px] border-[10px] border-transparent box-border pointer-events-none lg:static lg:h-auto lg:max-h-none lg:w-auto lg:max-w-none lg:overflow-visible lg:rounded-none lg:border-0"
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
            } ${isMobile ? "mobile-stream-inner" : ""}`}
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

            {/* Editorial narrative chapters: WHO / WHY / WHAT / HOW / BUILD + Expertise, Tools, Trust, Portfolio, Testimonials, Contact */}
            <EditorialStream onSectionChange={setActiveSection} />
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
            className="fixed inset-0 bg-black/90 z-40 flex flex-col items-center justify-center pointer-events-none select-none"
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
