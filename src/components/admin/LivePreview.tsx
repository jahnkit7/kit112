import { Globe, CreditCard, Palette, Rocket, Code, Shield, Zap, Heart, LucideIcon } from "lucide-react";

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

interface ProfilePreviewData {
  name?: string;
  title?: string;
  tagline?: string;
  status_text?: string;
  photo_url?: string | null;
}

interface SkillPreviewData {
  title?: string;
  items?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

interface LivePreviewProps {
  profileData?: ProfilePreviewData;
  skillsData?: SkillPreviewData;
}

const LivePreview = ({ profileData, skillsData }: LivePreviewProps) => {
  return (
    <div className="glass rounded-xl p-6 sticky top-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Aperçu en temps réel
        </h3>
      </div>

      <div className="space-y-6">
        {/* Profile Preview */}
        {profileData && (
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Profil
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary border border-border">
                {profileData.photo_url ? (
                  <img
                    src={profileData.photo_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-lg font-bold">
                    {profileData.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-foreground truncate">
                  {profileData.name || "Nom"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profileData.title || "Titre"}
                </p>
              </div>
            </div>
            {profileData.tagline && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {profileData.tagline}
              </p>
            )}
            {profileData.status_text && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-primary">{profileData.status_text}</span>
              </div>
            )}
          </div>
        )}

        {/* Skills Preview */}
        {skillsData && skillsData.items && skillsData.items.length > 0 && (
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              {skillsData.title || "Compétences"}
            </h4>
            <div className="space-y-2">
              {skillsData.items.slice(0, 4).map((skill, index) => {
                const IconComponent = iconMap[skill.icon] || Globe;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-background/50 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-3 h-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {skill.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                );
              })}
              {skillsData.items.length > 4 && (
                <p className="text-xs text-muted-foreground text-center pt-1">
                  +{skillsData.items.length - 4} autres compétences
                </p>
              )}
            </div>
          </div>
        )}

        {!profileData && !skillsData && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Modifiez les paramètres pour voir l'aperçu en temps réel.
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;
