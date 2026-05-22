import { useState } from "react";
import { MessageCircle, Mail, Linkedin, Circle } from "@/components/icons/hugeicons";
import { Button } from "@/components/ui/button";
import InterestFormModal from "./InterestFormModal";
import { useSetting } from "@/hooks/useSiteSettings";
import defaultProfilePhoto from "@/assets/profile-photo.png";

const LeftCard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: profile } = useSetting("profile");
  const { data: contact } = useSetting("contact");

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      contact?.whatsapp_message || "Bonjour, je souhaite planifier un échange de clarification."
    );
    const number = contact?.whatsapp_number || "221770000000";
    window.open(`https://wa.me/${number}?text=${message}`, "_blank");
  };

  // Use uploaded photo if available, otherwise use default
  const profilePhoto = profile?.photo_url || defaultProfilePhoto;

  return (
    <>
      <div className="glass rounded-2xl p-8 animate-slide-up">
        {/* Photo */}
        <div className="relative mb-6">
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-secondary">
            <img
              src={profilePhoto}
              alt={`${profile?.name || "Marie Janvier Kitcho"} - Entrepreneur digital`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-card px-4 py-1.5 rounded-full border border-border flex items-center gap-2">
            <Circle className="w-2 h-2 fill-primary text-primary animate-pulse" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {profile?.status_text || "Initiative ouverte – Phase pilote"}
            </span>
          </div>
        </div>

        {/* Name & Title */}
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            {profile?.name || "Marie Janvier Kitcho"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {profile?.title || "Entrepreneur digital & porteur de projets"}
          </p>
        </div>

        {/* Tagline */}
        <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">
          {profile?.tagline || "Je conçois et exécute des projets digitaux et opérationnels adaptés aux réalités africaines."}
        </p>

        {/* CTA Buttons */}
        <div className="space-y-3 mb-8">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            size="lg"
          >
            Manifester mon intérêt
          </Button>
          <Button
            onClick={openWhatsApp}
            variant="outline"
            className="w-full border-border hover:bg-secondary text-foreground"
            size="lg"
          >
            Échange de clarification – 20 min
          </Button>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4">
          <a
            href={`https://wa.me/${contact?.whatsapp_number || "221770000000"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${contact?.email || "contact@example.com"}`}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a
            href={contact?.linkedin_url || "https://linkedin.com/in/example"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>

      <InterestFormModal open={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  );
};

export default LeftCard;
