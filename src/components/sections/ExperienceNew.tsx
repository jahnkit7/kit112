import { useSetting } from "@/hooks/useSiteSettings";
import type { ExperienceItem } from "@/hooks/useSiteSettings";
import Reveal from "@/components/Reveal";

const professionalFallback: ExperienceItem[] = [
  { role: "Fondateur & dirigeant", company: "GoteaT", period: "2023 — Aujourd'hui", location: "Sénégal", description: "Restaurant en ligne construit autour d'une promesse simple : tout à partir de 500 F. Offre, marque, opérations et expérience de commande." },
  { role: "Co-fondateur & cogérant", company: "Creative Shop", period: "2023 — Aujourd'hui", location: "Sénégal", description: "Imprimerie, personnalisation et création d'objets personnalisés : production visuelle, supports de marque, merchandising et exécution client." },
  { role: "Product & Brand Builder", company: "Projets digitaux indépendants", period: "2020 — Aujourd'hui", location: "Afrique de l'Ouest", description: "Conception d'applications, plateformes, identités visuelles et supports commerciaux pour des projets tech, médias, retail et services." },
];

const educationFallback: ExperienceItem[] = [
  { role: "Formation professionnelle", company: "Compétences digitales & business", period: "Parcours continu", location: "", description: "Produit digital, design d'interface, branding, gestion de projet, opérations, outils web et stratégie commerciale." },
];

const splitItems = (items: ExperienceItem[]) => {
  const educationWords = ["formation", "diplôme", "licence", "master", "bts", "université", "école", "certificat"];
  const education = items.filter((item) => educationWords.some((word) => `${item.role} ${item.company}`.toLowerCase().includes(word)));
  const professional = items.filter((item) => !education.includes(item));
  return { professional: professional.length ? professional : professionalFallback, education: education.length ? education : educationFallback };
};

const TimelineList = ({ items, start = 1 }: { items: ExperienceItem[]; start?: number }) => (
  <div className="space-y-3">
    {items.map((item, index) => (
      <Reveal key={`${item.company}-${index}`} delay={index * 60}>
        <article className="grid sm:grid-cols-[110px_1fr] gap-4 rounded-[1.4rem] soft-card p-5 sm:p-6">
          <div className="font-mono text-xs text-muted-foreground">{String(index + start).padStart(2, "0")}</div>
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <span>{item.period}</span>
              {item.location && <span>{item.location}</span>}
            </div>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-semibold leading-tight">
              {item.role} <span className="text-muted-foreground">·</span> {item.company}
            </h3>
            {item.description && <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-muted-foreground">{item.description}</p>}
          </div>
        </article>
      </Reveal>
    ))}
  </div>
);

const ExperienceNew = () => {
  const { data } = useSetting("experiences");
  const source = data?.items?.length ? data.items : professionalFallback;
  const { professional, education } = splitItems(source);

  return (
    <section id="parcours" className="py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <div className="mb-10 sm:mb-14 grid lg:grid-cols-[.88fr_1.12fr] gap-7 items-end">
            <h2 className="mega-type text-[clamp(3.8rem,13vw,9.5rem)] uppercase">
              parcours<span className="text-primary-deep">.</span>
            </h2>
            <p className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed lg:pb-4">
              Pas un CV étalé. Une lecture claire : d'abord l'exécution professionnelle, ensuite la formation et les bases de compétences.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[280px_1fr] gap-7 lg:gap-10">
          <aside className="lg:sticky lg:top-28 h-fit rounded-[1.7rem] bg-foreground p-6 text-background">
            <p className="text-xs uppercase tracking-[0.22em] text-background/55">Organisation</p>
            <div className="mt-8 space-y-5">
              <a href="#parcours-pro" className="block font-display text-3xl font-semibold hover:text-primary transition-colors">Professionnel</a>
              <a href="#formation" className="block font-display text-3xl font-semibold hover:text-primary transition-colors">Formation</a>
            </div>
          </aside>

          <div className="space-y-10">
            <div id="parcours-pro">
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-border-strong pb-3">
                <h3 className="font-display text-3xl sm:text-5xl font-semibold">Expérience professionnelle</h3>
                <span className="font-mono text-xs text-muted-foreground">{professional.length} lignes</span>
              </div>
              <TimelineList items={professional} />
            </div>

            <div id="formation">
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-border-strong pb-3">
                <h3 className="font-display text-3xl sm:text-5xl font-semibold">Formation & socle</h3>
                <span className="font-mono text-xs text-muted-foreground">séparé</span>
              </div>
              <TimelineList items={education} start={professional.length + 1} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceNew;