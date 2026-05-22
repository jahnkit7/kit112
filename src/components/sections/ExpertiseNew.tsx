import Reveal from "@/components/Reveal";
import { ArrowUpRight } from "@/components/icons/hugeicons";

const items = [
  { title: "Produit digital", desc: "Applications, plateformes, parcours utilisateurs, systèmes métiers et outils conçus pour être utilisés vraiment." },
  { title: "Branding", desc: "Identité, direction artistique, supports imprimés, packaging et cohérence visuelle de marque." },
  { title: "Business", desc: "Positionnement, offre, logique de revenus, acquisition, partenariats et structuration progressive." },
  { title: "Opérations", desc: "Organisation terrain, process, coordination, production, livraison et amélioration continue." },
  { title: "Food concept", desc: "GoteaT : restauration en ligne, offre accessible, logique de volume et expérience de commande simple." },
  { title: "Creative production", desc: "Creative Shop : impression, personnalisation, objets de marque et exécution graphique concrète." },
];

const ExpertiseNew = () => {
  return (
    <section id="expertise" className="py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-8 lg:gap-14 items-end mb-10 sm:mb-14">
            <h2 className="mega-type text-[clamp(3.6rem,12vw,9rem)] uppercase">
              champ<br />d'action<span className="text-primary-deep">.</span>
            </h2>
            <p className="max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground lg:pb-4">
              Un profil hybride : capable de penser l'expérience, construire le produit, designer la marque et tenir l'exécution jusqu'au terrain.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 55}>
              <article className={`group min-h-[250px] rounded-[1.7rem] p-6 sm:p-7 soft-card transition-transform duration-500 hover:-translate-y-1 ${index === 1 || index === 4 ? "bg-primary" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:rotate-[-12deg]">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="mt-14 font-display text-3xl sm:text-4xl font-semibold leading-none">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                  {item.desc}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseNew;