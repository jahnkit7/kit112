import { useState } from "react";
import { Button } from "@/components/ui/button";
import InterestFormModal from "@/components/InterestFormModal";
import { useSetting } from "@/hooks/useSiteSettings";

const CTASection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: cta } = useSetting("cta");
  const { data: contact } = useSetting("contact");

  const title = cta?.title || "Prêt à rejoindre l'initiative ?";
  const subtitle = cta?.subtitle || "Cette initiative s'adresse à des personnes sérieuses, prêtes à construire sur des bases claires.";
  const buttonPrimary = cta?.button_primary || "Manifester mon intérêt";
  const buttonSecondary = cta?.button_secondary || "Échange de clarification – 20 min";

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      contact?.whatsapp_message || "Bonjour, je souhaite planifier un échange de clarification."
    );
    const number = contact?.whatsapp_number || "221770000000";
    window.open(`https://wa.me/${number}?text=${message}`, "_blank");
  };

  return (
    <>
      <section className="py-24 border-t border-border/50">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            {title}
          </h3>

          <p className="text-muted-foreground mb-10">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8"
              size="lg"
            >
              {buttonPrimary}
            </Button>
            <Button
              onClick={openWhatsApp}
              variant="outline"
              className="border-border hover:bg-secondary text-foreground px-8"
              size="lg"
            >
              {buttonSecondary}
            </Button>
          </div>
        </div>
      </section>

      <InterestFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  );
};

export default CTASection;
