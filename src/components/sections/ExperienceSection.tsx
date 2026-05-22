import { Briefcase, MapPin } from "@/components/icons/hugeicons";
import { useSetting } from "@/hooks/useSiteSettings";

const ExperienceSection = () => {
  const { data: experiences } = useSetting("experiences");

  const title = experiences?.title || "Expérience professionnelle";
  const items = experiences?.items || [];

  if (items.length === 0) return null;

  return (
    <section id="experience" className="py-20 border-t border-border/50">
      <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12">
        {title}
      </h3>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border hidden sm:block" />

        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={index} className="relative flex items-start gap-6 group">
              <div className="relative z-10 w-10 h-10 rounded-full bg-card border-2 border-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                <Briefcase className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
              </div>

              <div className="flex-1 pb-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <h4 className="font-display text-lg font-semibold text-foreground">
                    {item.role}
                  </h4>
                  <span className="text-sm text-primary font-medium">
                    {item.period}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">{item.company}</span>
                  {item.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
