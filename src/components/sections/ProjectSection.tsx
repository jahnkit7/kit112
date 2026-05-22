import { Target, Lightbulb, TrendingUp, Layers, LucideIcon } from "@/components/icons/hugeicons";
import { useSetting } from "@/hooks/useSiteSettings";

const iconMap: Record<string, LucideIcon> = {
  Target,
  Lightbulb,
  TrendingUp,
  Layers,
};

const defaultFeatures = [
  { icon: "Target", text: "Problème clair et concret" },
  { icon: "Lightbulb", text: "Solution simple et compréhensible" },
  { icon: "TrendingUp", text: "Déploiement progressif" },
  { icon: "Layers", text: "Phase pilote avant toute expansion" },
];

const ProjectSection = () => {
  const { data: project } = useSetting("project");

  const badge = project?.badge || "Projet pilote";
  const title = project?.title || "CAISSE PLUS";
  const description = project?.description || "CAISSE PLUS est une solution digitale simple destinée à faciliter la gestion des encaissements et paiements, pensée pour les réalités locales.";
  const features = project?.features || defaultFeatures;

  return (
    <section id="project" className="py-20 border-t border-border/50">
      <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
        {badge}
      </div>

      <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
        {title}
      </h3>

      <p className="text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed">
        {description}
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {features.map((feature) => {
          const IconComponent = iconMap[feature.icon] || Target;
          return (
            <div
              key={feature.text}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground">{feature.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectSection;
