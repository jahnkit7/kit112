import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Mail, MessageCircle, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlurFade, MaskReveal, WordStagger } from "@/gemini/components/CinematicReveal";

/**
 * Editorial Stream — narrative chapters that replace the classic "About → Expertise → Stats → CTA"
 * stack inside the right-side scroll column of the Hero phone experience.
 *
 * Inspired by editorial cinema sites (giant left word + dense right text), adapted for the
 * Hero's narrow stream container. Each chapter is a near-screen-height "page" with a giant
 * uppercase word anchored left/top + premium body copy on the right/bottom.
 */

interface Props {
  onSectionChange?: (section: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- CHAPTER ---------- */
interface ChapterProps {
  id?: string;
  word: string;
  eyebrow: string;
  lead: string;
  body?: string;
  lines?: string[];
  onEnter?: () => void;
  accent?: string;
}

const Chapter = ({ id, word, eyebrow, lead, body, lines, onEnter, accent = "text-white" }: ChapterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.25, 1, 1, 0.25]);

  return (
    <motion.section
      ref={ref}
      id={id}
      onViewportEnter={onEnter}
      viewport={{ amount: 0.35 }}
      className="relative min-h-[88vh] flex flex-col justify-center border-t border-white/5 pt-10 lg:pt-20 scroll-mt-24"
    >
      <BlurFade y={8} duration={0.7}>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange/80 mb-6 lg:mb-10">
          {eyebrow}
        </div>
      </BlurFade>

      <motion.div style={{ y, opacity }} className="relative">
        <h2
          className={`font-display font-black uppercase leading-[0.85] tracking-[-0.04em] text-[clamp(4.5rem,18vw,12rem)] lg:text-[clamp(7rem,14vw,16rem)] ${accent} mix-blend-difference select-none`}
          aria-hidden
        >
          {word}
        </h2>
      </motion.div>

      <div className="mt-8 lg:mt-12 max-w-2xl space-y-6">
        <MaskReveal duration={1.05}>
          <p className="text-white text-xl md:text-3xl lg:text-4xl font-light leading-[1.15] tracking-tight whitespace-pre-line">
            {lead}
          </p>
        </MaskReveal>

        {lines && (
          <div className="space-y-1.5 pt-2">
            {lines.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                className="text-white/90 text-lg md:text-2xl font-light"
              >
                {l}
              </motion.div>
            ))}
          </div>
        )}

        {body && (
          <BlurFade delay={0.2}>
            <p className="text-zinc-400 text-sm md:text-base font-light leading-relaxed max-w-xl">
              {body}
            </p>
          </BlurFade>
        )}
      </div>
    </motion.section>
  );
};

/* ---------- EXPERTISE CARDS ---------- */
const EXPERTISES = [
  { code: "01", title: "Product Systems", desc: "Plateformes, parcours utilisateurs et outils métiers conçus pour durer." },
  { code: "02", title: "Branding & Identity", desc: "Identités visuelles, direction artistique, systèmes graphiques cohérents." },
  { code: "03", title: "Payment Solutions", desc: "Encaissement, mobile money, intégrations terrain et flux marchands." },
  { code: "04", title: "Restaurant Concepts", desc: "GoteaT et concepts food : offre, expérience commande, opérations." },
  { code: "05", title: "Operational Execution", desc: "Process, coordination, production, livraison, amélioration continue." },
  { code: "06", title: "UI / UX & Interfaces", desc: "Interfaces simples, fonctionnelles, accessibles, optimisées mobile." },
  { code: "07", title: "Printing & Manufacturing", desc: "Creative Shop : impression, personnalisation, objets de marque." },
  { code: "08", title: "Business Development", desc: "Positionnement, offre, partenariats, structuration progressive." },
];

const ExpertiseGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-2">
    {EXPERTISES.map((e, i) => (
      <motion.article
        key={e.code}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: EASE }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 p-5 md:p-6 transition-colors hover:border-brand-orange/40"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_30%_20%,rgba(255,107,71,0.12),transparent_60%)]" />
        <div className="relative flex items-start justify-between gap-3">
          <span className="font-mono text-[10px] tracking-widest text-zinc-500">{e.code}</span>
          <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-brand-orange group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
        </div>
        <h4 className="relative mt-8 font-display text-xl md:text-2xl font-medium text-white tracking-tight">
          {e.title}
        </h4>
        <p className="relative mt-2.5 text-[13px] leading-relaxed text-zinc-400 font-light">
          {e.desc}
        </p>
      </motion.article>
    ))}
  </div>
);

/* ---------- TOOLS WALL ---------- */
const TOOLS = [
  "Photoshop", "Illustrator", "After Effects", "Figma", "Canva",
  "WordPress", "Shopify", "Framer", "VS Code", "Adobe Suite",
  "Envato", "AI Tools", "Mobile Money APIs", "SaaS Systems", "POS Systems",
];

const ToolsWall = () => (
  <div className="flex flex-wrap gap-2 md:gap-2.5 pt-2">
    {TOOLS.map((t, i) => (
      <motion.span
        key={t}
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, delay: i * 0.03, ease: EASE }}
        className="group relative cursor-default rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-widest text-zinc-300 hover:border-brand-orange/40 hover:text-white hover:bg-white/[0.06] transition-all"
      >
        <span className="absolute -inset-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(255,107,71,0.18),transparent_70%)] pointer-events-none" />
        <span className="relative">{t}</span>
      </motion.span>
    ))}
  </div>
);

/* ---------- TRUST MARQUEE ---------- */
const PARTNERS = ["GoteaT", "Creative Shop", "MJK Studio", "Vision Lab", "Atelier Nord", "Studio Lumen", "Northbound", "Maison Hybrid"];
const TrustMarquee = () => (
  <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/40 py-6 [mask-image:linear-gradient(to_right,transparent_0,black_64px,black_calc(100%-64px),transparent_100%)]">
    <motion.div
      animate={{ x: [0, "-50%"] }}
      transition={{ ease: "linear", duration: 28, repeat: Infinity }}
      className="flex gap-10 w-[200%]"
    >
      {[...PARTNERS, ...PARTNERS].map((p, i) => (
        <span
          key={i}
          className="font-display text-lg md:text-2xl font-medium text-white/40 hover:text-white transition-colors whitespace-nowrap"
        >
          {p}
        </span>
      ))}
    </motion.div>
  </div>
);

/* ---------- PORTFOLIO ---------- */
interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  year: string | null;
  role: string | null;
}

const PortfolioGallery = () => {
  const { data: items = [] } = useQuery({
    queryKey: ["editorial-portfolio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("id,title,description,image_url,category,year,role")
        .order("display_order", { ascending: true })
        .limit(9);
      if (error) throw error;
      return (data ?? []) as unknown as PortfolioItem[];
    },
  });

  if (!items.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-2">
      {items.map((p, i) => (
        <motion.a
          key={p.id}
          href="#"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: (i % 4) * 0.08, ease: EASE }}
          className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 ${
            i % 5 === 0 ? "sm:col-span-2" : ""
          }`}
        >
          <div className="relative aspect-[4/5] sm:aspect-[5/4] overflow-hidden">
            <img
              src={p.image_url}
              alt={p.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.2s] scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <div className="flex flex-wrap items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-white/60 mb-2">
              {p.category && <span>{p.category}</span>}
              {p.year && <span>· {p.year}</span>}
              {p.role && <span>· {p.role}</span>}
            </div>
            <h4 className="font-display text-xl md:text-2xl font-medium leading-tight">{p.title}</h4>
            {p.description && (
              <p className="mt-1.5 text-[12px] text-white/70 line-clamp-2 font-light leading-relaxed">
                {p.description}
              </p>
            )}
          </div>
          <span className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </span>
        </motion.a>
      ))}
    </div>
  );
};

/* ---------- TESTIMONIALS ---------- */
const TESTIMONIALS = [
  { q: "Une exécution rare. Il pense le projet, le construit et le tient jusqu'au terrain.", a: "Directrice — Concept Food", },
  { q: "Stratégique, créatif, opérationnel. Trois profils en un seul interlocuteur.", a: "Fondateur — Studio Indépendant", },
  { q: "On a senti la maîtrise dès la première réunion. Les livrables ont suivi.", a: "Lead Produit — Plateforme E-commerce", },
];

const Testimonials = () => (
  <div className="space-y-6 pt-2">
    {TESTIMONIALS.map((t, i) => (
      <motion.blockquote
        key={i}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
        className="relative border-l border-white/10 pl-5 md:pl-7"
      >
        <span className="absolute -left-px top-0 h-8 w-px bg-brand-orange" />
        <p className="font-display text-xl md:text-3xl font-light text-white leading-[1.2] tracking-tight italic">
          “{t.q}”
        </p>
        <footer className="mt-3 text-[11px] font-mono uppercase tracking-widest text-zinc-500">
          — {t.a}
        </footer>
      </motion.blockquote>
    ))}
  </div>
);

/* ---------- CONTACT ---------- */
const Contact = () => (
  <div className="space-y-8 pt-2">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {[
        { Icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/" },
        { Icon: Mail, label: "Email", href: "mailto:hello@example.com" },
        { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
      ].map(({ Icon, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/60 px-5 py-4 hover:border-brand-orange/40 hover:bg-zinc-950 transition-all"
        >
          <span className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-brand-orange" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-white">{label}</span>
          </span>
          <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
        </a>
      ))}
    </div>
  </div>
);

/* ---------- SECTION WRAPPER ---------- */
const SectionBlock = ({
  id,
  eyebrow,
  title,
  subtitle,
  onEnter,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  onEnter?: () => void;
  children: React.ReactNode;
}) => (
  <motion.section
    id={id}
    onViewportEnter={onEnter}
    viewport={{ amount: 0.15 }}
    className="border-t border-white/5 pt-10 lg:pt-20 space-y-8 lg:space-y-12 scroll-mt-24"
  >
    <div className="space-y-4 max-w-2xl">
      <BlurFade y={8} duration={0.6}>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange/80">
          {eyebrow}
        </div>
      </BlurFade>
      <WordStagger
        as="h2"
        text={title}
        className="font-display text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.05] tracking-tight"
        stagger={0.06}
      />
      {subtitle && (
        <BlurFade delay={0.1}>
          <p className="text-zinc-400 text-sm md:text-base font-light leading-relaxed max-w-xl">
            {subtitle}
          </p>
        </BlurFade>
      )}
    </div>
    {children}
  </motion.section>
);

/* ---------- MAIN ---------- */
const EditorialStream = ({ onSectionChange }: Props) => {
  const set = (s: string) => onSectionChange?.(s);

  return (
    <div className="space-y-16 lg:space-y-28">
      {/* CHAPTER 01 — WHO (also serves as #about anchor) */}
      <Chapter
        id="about"
        eyebrow="Chapitre 01 — Identité"
        word="WHO."
        lead={`Entrepreneur créatif,\ndéveloppeur de systèmes\net opérateur terrain.`}
        body="Je construis des projets où technologie, branding, stratégie et exécution travaillent ensemble pour créer des expériences utiles, claires et durables. Au fil des années, j'ai participé à la création de plateformes digitales, solutions d'encaissement, concepts food, systèmes de marque et opérations commerciales dans plusieurs villes africaines."
        onEnter={() => set("about")}
      />

      {/* CHAPTER 02 — WHY */}
      <Chapter
        eyebrow="Chapitre 02 — Conviction"
        word="WHY."
        lead="Parce qu'un projet ne doit pas seulement être beau."
        lines={[
          "Il doit fonctionner.",
          "Il doit être compris.",
          "Et surtout : il doit survivre au terrain.",
        ]}
        body="Chaque système, marque ou expérience est pensé pour répondre à des réalités concrètes avec simplicité, clarté et efficacité."
      />

      {/* CHAPTER 03 — WHAT */}
      <Chapter
        eyebrow="Chapitre 03 — Réalisations"
        word="WHAT."
        lead="Des plateformes digitales."
        lines={[
          "Des identités visuelles.",
          "Des systèmes d'encaissement.",
          "Des concepts de restauration.",
          "Des outils opérationnels.",
          "Des expériences de marque.",
        ]}
        body="Je conçois des systèmes hybrides où produit, design et exécution avancent ensemble."
      />

      {/* CHAPTER 04 — HOW */}
      <Chapter
        eyebrow="Chapitre 04 — Méthode"
        word="HOW."
        lead="Comprendre. Simplifier. Structurer. Tester. Déployer."
        body="Mon approche repose sur l'équilibre entre direction créative, logique produit et efficacité opérationnelle."
      />

      {/* CHAPTER 05 — BUILD (also serves as #parcours anchor for nav) */}
      <Chapter
        id="parcours"
        eyebrow="Chapitre 05 — Engagement"
        word="BUILD."
        lead="Créer des projets capables d'exister dans le réel."
        body="Du branding à l'exécution terrain, chaque détail est pensé pour être cohérent, fonctionnel et évolutif."
        onEnter={() => set("parcours")}
      />

      {/* EXPERTISES */}
      <SectionBlock
        id="expertise"
        eyebrow="Domaines d'expertise"
        title="Un profil hybride entre stratégie, design, produit et exécution."
        onEnter={() => set("expertise")}
      >
        <ExpertiseGrid />
      </SectionBlock>

      {/* TOOLS & ECOSYSTEM */}
      <SectionBlock
        eyebrow="Tools & Ecosystem"
        title="L'écosystème qui rend l'exécution possible."
        subtitle="Outils créatifs, plateformes, APIs et systèmes intégrés au quotidien dans les projets."
      >
        <ToolsWall />
      </SectionBlock>

      {/* TRUST */}
      <SectionBlock
        eyebrow="Collaborations"
        title="Trusted by visionaries."
        subtitle="Des collaborations construites autour de la confiance, de l'exécution et de la vision."
      >
        <TrustMarquee />
      </SectionBlock>

      {/* PORTFOLIO */}
      <SectionBlock
        eyebrow="Portfolio"
        title="Projets, systèmes, expériences."
        subtitle="Une galerie immersive de réalisations construites entre produit, marque et exécution."
      >
        <PortfolioGallery />
      </SectionBlock>

      {/* TESTIMONIALS */}
      <SectionBlock
        eyebrow="Témoignages"
        title="La voix de ceux qui m'ont fait confiance."
      >
        <Testimonials />
      </SectionBlock>

      {/* CONTACT */}
      <SectionBlock
        id="contact"
        eyebrow="Contact"
        title="Construisons quelque chose d'utile."
        subtitle="Parlons stratégie, produit et exécution."
        onEnter={() => set("contact")}
      >
        <Contact />
      </SectionBlock>
    </div>
  );
};

export default EditorialStream;
