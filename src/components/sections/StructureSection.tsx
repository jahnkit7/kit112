import { useSetting } from "@/hooks/useSiteSettings";

const StructureSection = () => {
  const { data: structure } = useSetting("structure");

  const title = structure?.title || "Structure et gouvernance";
  const totalParts = structure?.total_parts || 100;
  const founderPercent = structure?.founder_percent || 51;
  const collectivePercent = structure?.collective_percent || 49;
  const partPrice = structure?.part_price || 50000;
  const founderName = structure?.founder_name || "Marie Janvier Kitcho";
  const explanation1 = structure?.explanation_1 || "Une part fondatrice est réservée à l'initiateur du projet, correspondant à la conception, la coordination et l'exécution opérationnelle.";
  const explanation2 = structure?.explanation_2 || "Les 49 parts restantes sont ouvertes au collectif, permettant une participation équitable tout en maintenant une gouvernance claire et une prise de décision efficace.";
  const investmentNote = structure?.investment_note || "Investissement libre au-delà du minimum";

  return (
    <section id="structure" className="py-20 border-t border-border/50">
      <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
        {title}
      </h3>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Stats */}
        <div className="space-y-6">
          <div className="glass rounded-xl p-6">
            <div className="text-3xl font-display font-bold text-primary mb-1">{totalParts}</div>
            <div className="text-muted-foreground">Parts totales</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-6">
              <div className="text-2xl font-display font-bold text-foreground mb-1">{founderPercent}%</div>
              <div className="text-sm text-muted-foreground">Parts fondateur ({founderName})</div>
            </div>
            <div className="glass rounded-xl p-6">
              <div className="text-2xl font-display font-bold text-primary mb-1">{collectivePercent}%</div>
              <div className="text-sm text-muted-foreground">Parts collectif</div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="text-xl font-display font-bold text-foreground mb-1">
              {partPrice.toLocaleString("fr-FR")} CFA
            </div>
            <div className="text-muted-foreground">= 1 part</div>
            <p className="text-sm text-muted-foreground mt-2">
              {investmentNote}
            </p>
          </div>
        </div>

        {/* Right: Explanation */}
        <div className="flex flex-col justify-center">
          <p className="text-muted-foreground leading-relaxed">
            {explanation1}
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            {explanation2}
          </p>
        </div>
      </div>
    </section>
  );
};

export default StructureSection;
