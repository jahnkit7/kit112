import Reveal from "@/components/Reveal";

const metrics = [
  ["03", "territoires", "Sénégal, Afrique de l'Ouest, projets à portée internationale"],
  ["06+", "domaines", "tech, food, retail, print, branding, opérations"],
  ["10+", "livrables", "interfaces, marques, supports, concepts, systèmes"],
  ["100%", "terrain", "une approche qui relie stratégie, design et exécution"],
];

const ImpactNew = () => {
  return (
    <section id="impact" className="py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <div className="mb-10 grid lg:grid-cols-[1fr_1fr] gap-7 items-end">
            <h2 className="mega-type text-[clamp(3.9rem,13vw,9.2rem)] uppercase">
              impact<span className="text-primary-deep">.</span>
            </h2>
            <p className="max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground lg:pb-4">
              Une trajectoire construite par l'action : créer, tester, vendre, produire, livrer et améliorer.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map(([k, l, s], index) => (
            <Reveal key={l} delay={index * 60}>
              <article className="min-h-[230px] rounded-[1.7rem] soft-card p-6 flex flex-col justify-between">
                <div className="font-display text-6xl sm:text-7xl font-semibold leading-none">{k}</div>
                <div>
                  <h3 className="font-display text-2xl font-semibold">{l}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactNew;