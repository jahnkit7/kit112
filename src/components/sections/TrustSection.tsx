import { Ban, FileText, Users, DoorOpen, MessageSquare, LucideIcon } from "@/components/icons/hugeicons";
import { useSetting } from "@/hooks/useSiteSettings";

const iconMap: Record<string, LucideIcon> = {
  Ban,
  FileText,
  Users,
  DoorOpen,
  MessageSquare,
};

const defaultGuarantees = [
  { icon: "Ban", text: "Pas de paiement immédiat" },
  { icon: "FileText", text: "Règles écrites avant engagement" },
  { icon: "Users", text: "Gouvernance claire" },
  { icon: "DoorOpen", text: "Possibilité de sortie encadrée" },
  { icon: "MessageSquare", text: "Communication collective" },
];

const TrustSection = () => {
  const { data: trust } = useSetting("trust");

  const title = trust?.title || "Confiance & garde-fous";
  const guarantees = trust?.guarantees || defaultGuarantees;

  return (
    <section id="trust" className="py-20 border-t border-border/50">
      <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">
        {title}
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {guarantees.map((item) => {
          const IconComponent = iconMap[item.icon] || Ban;
          return (
            <div
              key={item.text}
              className="flex items-center gap-4 p-5 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground font-medium">{item.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustSection;
