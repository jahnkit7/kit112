import { Globe, CreditCard, Palette, Rocket, Code, Shield, Zap, Heart, LucideIcon } from "@/components/icons/hugeicons";
import { useSetting } from "@/hooks/useSiteSettings";

const iconMap: Record<string, LucideIcon> = {
  Globe,
  CreditCard,
  Palette,
  Rocket,
  Code,
  Shield,
  Zap,
  Heart,
};

const defaultSkills = [
  {
    icon: "Globe",
    title: "Plateformes web & applications",
    description: "Sites vitrines, applications métier, outils SaaS",
  },
  {
    icon: "CreditCard",
    title: "Solutions de paiement & encaissement",
    description: "Intégration mobile money, terminaux, gestion de caisse",
  },
  {
    icon: "Palette",
    title: "Branding, impression & produits",
    description: "Identité visuelle, supports imprimés, merchandising",
  },
  {
    icon: "Rocket",
    title: "Exécution opérationnelle",
    description: "Gestion de projet, coordination d'équipe, livraison terrain",
  },
];

const SkillsSection = () => {
  const { data: skills } = useSetting("skills");

  const title = skills?.title || "Ce que je sais faire";
  const items = skills?.items || defaultSkills;

  return (
    <section id="skills" className="py-20 border-t border-border/50">
      <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">
        {title}
      </h3>

      <div className="grid sm:grid-cols-2 gap-6">
        {items.map((skill, index) => {
          const IconComponent = iconMap[skill.icon] || Globe;
          return (
            <div
              key={skill.title}
              className="glass rounded-xl p-6 hover-lift cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-display text-lg font-semibold text-foreground mb-2">
                {skill.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {skill.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SkillsSection;
