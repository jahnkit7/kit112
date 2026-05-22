import { useSetting } from "@/hooks/useSiteSettings";

const AboutSection = () => {
  const { data: about } = useSetting("about");

  const title = about?.title || "Qui je suis";
  const paragraphs = about?.paragraphs || [
    "Je suis entrepreneur digital et créatif.",
    "Je conçois, développe et exécute des projets concrets : plateformes web, applications, solutions d'encaissement, impression & branding, ainsi que des concepts de restauration.",
    "J'ai dirigé et opéré des projets à Dakar et ailleurs, en combinant vision, technique et exécution terrain."
  ];

  return (
    <section id="about" className="py-20 border-t border-border/50">
      <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
        {title}
      </h3>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={index === 0 ? "text-lg" : ""}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
