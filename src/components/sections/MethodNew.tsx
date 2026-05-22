import Reveal from "@/components/Reveal";

const steps = [
  ["01", "Observer", "Comprendre les usages, le marché, les contraintes et les points de friction réels."],
  ["02", "Structurer", "Transformer l'intuition en offre lisible, process simple et architecture produit."],
  ["03", "Designer", "Créer une présence claire : identité, interface, messages, supports et expérience."],
  ["04", "Exécuter", "Lancer vite, tester sur le terrain, ajuster, documenter et rendre le système stable."],
];

const MethodNew = () => {
  return (
    <section id="vision" className="py-20 sm:py-28 bg-foreground text-background overflow-hidden">
      <div className="container">
        <Reveal>
          <div className="mb-12 sm:mb-16">
            <p className="mb-4 text-xs uppercase tracking-[0.22em] text-background/55">Méthode stratégique</p>
            <h2 className="mega-type text-[clamp(3.8rem,13vw,10rem)] uppercase">
              du réel<br />au système<span className="text-primary">.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-4 border-y border-background/18">
          {steps.map(([n, t, d], index) => (
            <Reveal key={n} delay={index * 70}>
              <article className="min-h-[260px] border-b border-background/18 p-6 sm:p-8 lg:border-b-0 lg:border-r last:border-r-0 border-background/18">
                <div className="text-sm font-mono text-primary">{n}</div>
                <h3 className="mt-12 font-display text-4xl font-semibold">{t}</h3>
                <p className="mt-5 text-sm leading-relaxed text-background/66">{d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodNew;