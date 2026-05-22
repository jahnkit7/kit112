import { useSetting } from "@/hooks/useSiteSettings";
import profilePhoto from "@/assets/profile-photo.png";
import Reveal from "@/components/Reveal";
import { ArrowDownRight, ArrowUpRight } from "@/components/icons/hugeicons";

const DEFAULT_TAGS = [
  "Product builder", "Brand systems", "Digital platforms", "Operations terrain", "Food concept", "Print & merch",
];

const HeroNew = () => {
  const { data: hero } = useSetting("hero");
  const { data: profile } = useSetting("profile");
  const name = profile?.name || "Marie Janvier Kitcho";
  const title = profile?.title || "Entrepreneur digital · Product builder · Creative operator";
  const subtitle = hero?.subtitle || profile?.tagline || "Je transforme des idées en marques, plateformes et opérations concrètes, pensées pour les usages africains et les contraintes du terrain.";

  return (
    <section className="relative min-h-[94vh] pt-24 sm:pt-28 pb-10 overflow-hidden">
      <div className="container">
        <Reveal>
          <div className="flex items-center justify-between gap-4 text-[11px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span>{profile?.status_text || "Disponible pour projets ambitieux"}</span>
            <span className="hidden sm:inline">Dakar · Afrique de l'Ouest</span>
          </div>
        </Reveal>

        <div className="mt-10 grid lg:grid-cols-[1.02fr_.98fr] gap-7 lg:gap-10 items-stretch">
          <div className="relative z-10 flex flex-col justify-between min-h-[520px] sm:min-h-[610px]">
            <Reveal delay={80}>
              <div>
                <p className="mb-4 max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {title}
                </p>
                <h1 className="mega-type text-[clamp(4.35rem,18vw,12.2rem)] uppercase">
                  <span className="block">Marie</span>
                  <span className="block">Janvier</span>
                  <span className="block text-primary-deep">Kitcho</span>
                </h1>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-8 grid sm:grid-cols-[1fr_auto] gap-6 items-end">
                <p className="max-w-xl text-base sm:text-lg leading-relaxed text-foreground">
                  {subtitle}
                </p>
                <a
                  href="#portfolio"
                  className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:rotate-[-12deg]"
                  aria-label="Voir les projets"
                >
                  <ArrowDownRight className="h-7 w-7" />
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="relative min-h-[520px] sm:min-h-[610px] rounded-[2rem] sm:rounded-[2.5rem] bg-primary overflow-hidden soft-card">
              <div className="absolute left-6 top-6 z-20 rounded-full bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]">
                Vision · Exécution
              </div>
              <div className="absolute right-5 top-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
                <ArrowUpRight className="h-6 w-6" />
              </div>
              <div className="absolute inset-x-8 bottom-8 z-20 rounded-[1.6rem] bg-background/88 p-5 backdrop-blur-md ring-1 ring-border">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    ["2023", "GoteaT"],
                    ["2023", "Creative Shop"],
                    ["6+", "Domaines"],
                  ].map(([k, l]) => (
                    <div key={l}>
                      <div className="font-display text-2xl font-semibold">{k}</div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.13em] text-muted-foreground">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary-deep/65 to-transparent" />
              <img
                src={profile?.photo_url || profilePhoto}
                alt={`${name} — portrait`}
                className="absolute inset-x-0 bottom-0 mx-auto h-[92%] w-auto object-contain object-bottom grayscale contrast-110"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={260}>
        <div className="mt-10 overflow-hidden border-y border-border-strong bg-foreground text-background">
          <div className="marquee py-4">
            {[...DEFAULT_TAGS, ...DEFAULT_TAGS].map((tag, i) => (
              <span key={`${tag}-${i}`} className="whitespace-nowrap font-display text-3xl sm:text-5xl font-semibold uppercase">
                {tag}<span className="text-primary">.</span>
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default HeroNew;