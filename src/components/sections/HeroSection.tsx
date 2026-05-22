import { useSetting } from "@/hooks/useSiteSettings";

const HeroSection = () => {
  const { data: hero } = useSetting("hero");

  const title = hero?.title || "Construisons ensemble une solution utile, claire et maîtrisée.";
  const highlight = hero?.highlight || "solution utile";
  const subtitle = hero?.subtitle || "Une initiative portée par un entrepreneur africain, ouverte à un collectif structuré, sans promesses irréalistes ni paiement précipité.";

  // Split title around highlight
  const parts = title.split(highlight);

  return (
    <section className="min-h-[60vh] flex flex-col justify-center relative py-20">
      {/* Decorative shape */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-8 animate-fade-in">
          {parts.length > 1 ? (
            <>
              {parts[0]}
              <span className="text-gradient">{highlight}</span>
              {parts[1]}
            </>
          ) : (
            title
          )}
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
