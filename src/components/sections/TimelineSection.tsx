import { AlertCircle } from "@/components/icons/hugeicons";
import { useSetting } from "@/hooks/useSiteSettings";

const defaultSteps = [
  { number: 1, title: "Manifestation d'intérêt", subtitle: "sans paiement" },
  { number: 2, title: "Choix d'un engagement indicatif", subtitle: "minimum 50 000 CFA" },
  { number: 3, title: "Atteinte d'un seuil collectif", subtitle: "" },
  { number: 4, title: "Réunion de clarification", subtitle: "" },
  { number: 5, title: "Accord écrit", subtitle: "" },
  { number: 6, title: "Déblocage des fonds", subtitle: "" },
  { number: 7, title: "Lancement du projet pilote", subtitle: "" },
];

const TimelineSection = () => {
  const { data: timeline } = useSetting("timeline");

  const title = timeline?.title || "Comment fonctionne l'initiative";
  const steps = timeline?.steps || defaultSteps;
  const note = timeline?.note || "Aucun paiement n'est demandé avant validation collective et accord écrit.";

  return (
    <section id="process" className="py-20 border-t border-border/50">
      <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">
        {title}
      </h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border hidden sm:block" />

        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex items-start gap-6 group"
            >
              {/* Number circle */}
              <div className="relative z-10 w-10 h-10 rounded-full bg-card border-2 border-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <span className="font-display font-bold text-sm">{step.number}</span>
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <h4 className="font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h4>
                {step.subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important note */}
      <div className="mt-12 p-6 rounded-xl bg-primary/10 border border-primary/20 flex gap-4">
        <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-foreground font-medium">
          {note}
        </p>
      </div>
    </section>
  );
};

export default TimelineSection;
