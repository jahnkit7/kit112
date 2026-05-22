import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings, SettingsMap } from "@/hooks/useSiteSettings";
import { Loader2, Save } from "lucide-react";

interface ContentSettingsFormProps {
  settings: SettingsMap;
  section?: "structure" | "content";
}

const ContentSettingsForm = ({ settings, section = "content" }: ContentSettingsFormProps) => {
  const { updateSettingAsync } = useSiteSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState<string | null>(null);

  // Local state for each section
  const [hero, setHero] = useState(settings.hero);
  const [about, setAbout] = useState(settings.about);
  const [project, setProject] = useState(settings.project);
  const [timeline, setTimeline] = useState(settings.timeline);
  const [structure, setStructure] = useState(settings.structure);
  const [trust, setTrust] = useState(settings.trust);
  const [cta, setCta] = useState(settings.cta);

  const saveSection = async (key: string, value: unknown) => {
    setIsSaving(key);
    try {
      await updateSettingAsync({ key: key as "hero", value: value as SettingsMap["hero"] });
      toast({
        title: "Section mise à jour",
        description: "Les modifications ont été enregistrées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(null);
    }
  };

  if (section === "structure") {
    return (
      <div className="space-y-8">
        {/* Structure Section */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-display text-xl font-semibold text-foreground mb-6">
            Structure et gouvernance
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground">Titre</Label>
              <Input
                value={structure.title}
                onChange={(e) => setStructure({ ...structure, title: e.target.value })}
                className="bg-secondary border-border text-foreground mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground">Parts totales</Label>
                <Input
                  type="number"
                  value={structure.total_parts}
                  onChange={(e) => setStructure({ ...structure, total_parts: parseInt(e.target.value) || 0 })}
                  className="bg-secondary border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-foreground">Prix par part (CFA)</Label>
                <Input
                  type="number"
                  value={structure.part_price}
                  onChange={(e) => setStructure({ ...structure, part_price: parseInt(e.target.value) || 0 })}
                  className="bg-secondary border-border text-foreground mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground">% Fondateur</Label>
                <Input
                  type="number"
                  value={structure.founder_percent}
                  onChange={(e) => setStructure({ ...structure, founder_percent: parseInt(e.target.value) || 0 })}
                  className="bg-secondary border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-foreground">% Collectif</Label>
                <Input
                  type="number"
                  value={structure.collective_percent}
                  onChange={(e) => setStructure({ ...structure, collective_percent: parseInt(e.target.value) || 0 })}
                  className="bg-secondary border-border text-foreground mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-foreground">Nom du fondateur</Label>
              <Input
                value={structure.founder_name}
                onChange={(e) => setStructure({ ...structure, founder_name: e.target.value })}
                className="bg-secondary border-border text-foreground mt-1"
              />
            </div>
            <div>
              <Label className="text-foreground">Explication 1</Label>
              <Textarea
                value={structure.explanation_1}
                onChange={(e) => setStructure({ ...structure, explanation_1: e.target.value })}
                className="bg-secondary border-border text-foreground mt-1 resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-foreground">Explication 2</Label>
              <Textarea
                value={structure.explanation_2}
                onChange={(e) => setStructure({ ...structure, explanation_2: e.target.value })}
                className="bg-secondary border-border text-foreground mt-1 resize-none"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-foreground">Note investissement</Label>
              <Input
                value={structure.investment_note}
                onChange={(e) => setStructure({ ...structure, investment_note: e.target.value })}
                className="bg-secondary border-border text-foreground mt-1"
              />
            </div>
            <Button
              onClick={() => saveSection("structure", structure)}
              disabled={isSaving === "structure"}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSaving === "structure" ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enregistrement...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" />Enregistrer</>
              )}
            </Button>
          </div>
        </div>

        {/* Trust Section */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-display text-xl font-semibold text-foreground mb-6">
            Confiance & garde-fous
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-foreground">Titre</Label>
              <Input
                value={trust.title}
                onChange={(e) => setTrust({ ...trust, title: e.target.value })}
                className="bg-secondary border-border text-foreground mt-1"
              />
            </div>
            {trust.guarantees.map((guarantee, index) => (
              <div key={index}>
                <Label className="text-foreground">Garantie {index + 1}</Label>
                <Input
                  value={guarantee.text}
                  onChange={(e) => {
                    const newGuarantees = [...trust.guarantees];
                    newGuarantees[index] = { ...newGuarantees[index], text: e.target.value };
                    setTrust({ ...trust, guarantees: newGuarantees });
                  }}
                  className="bg-secondary border-border text-foreground mt-1"
                />
              </div>
            ))}
            <Button
              onClick={() => saveSection("trust", trust)}
              disabled={isSaving === "trust"}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSaving === "trust" ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enregistrement...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" />Enregistrer</>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-6">
          Section Hero
        </h3>
        <div className="space-y-4">
          <div>
            <Label className="text-foreground">Titre principal</Label>
            <Textarea
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1 resize-none"
              rows={2}
            />
          </div>
          <div>
            <Label className="text-foreground">Mot à mettre en valeur</Label>
            <Input
              value={hero.highlight}
              onChange={(e) => setHero({ ...hero, highlight: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1"
            />
          </div>
          <div>
            <Label className="text-foreground">Sous-titre</Label>
            <Textarea
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1 resize-none"
              rows={3}
            />
          </div>
          <Button
            onClick={() => saveSection("hero", hero)}
            disabled={isSaving === "hero"}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving === "hero" ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enregistrement...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Enregistrer</>
            )}
          </Button>
        </div>
      </div>

      {/* About Section */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-6">
          À propos
        </h3>
        <div className="space-y-4">
          <div>
            <Label className="text-foreground">Titre</Label>
            <Input
              value={about.title}
              onChange={(e) => setAbout({ ...about, title: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1"
            />
          </div>
          {about.paragraphs.map((paragraph, index) => (
            <div key={index}>
              <Label className="text-foreground">Paragraphe {index + 1}</Label>
              <Textarea
                value={paragraph}
                onChange={(e) => {
                  const newParagraphs = [...about.paragraphs];
                  newParagraphs[index] = e.target.value;
                  setAbout({ ...about, paragraphs: newParagraphs });
                }}
                className="bg-secondary border-border text-foreground mt-1 resize-none"
                rows={3}
              />
            </div>
          ))}
          <Button
            onClick={() => saveSection("about", about)}
            disabled={isSaving === "about"}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving === "about" ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enregistrement...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Enregistrer</>
            )}
          </Button>
        </div>
      </div>

      {/* Project Section */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-6">
          Projet pilote
        </h3>
        <div className="space-y-4">
          <div>
            <Label className="text-foreground">Badge</Label>
            <Input
              value={project.badge}
              onChange={(e) => setProject({ ...project, badge: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1"
            />
          </div>
          <div>
            <Label className="text-foreground">Titre du projet</Label>
            <Input
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1"
            />
          </div>
          <div>
            <Label className="text-foreground">Description</Label>
            <Textarea
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1 resize-none"
              rows={3}
            />
          </div>
          <Button
            onClick={() => saveSection("project", project)}
            disabled={isSaving === "project"}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving === "project" ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enregistrement...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Enregistrer</>
            )}
          </Button>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-6">
          Processus / Timeline
        </h3>
        <div className="space-y-4">
          <div>
            <Label className="text-foreground">Titre</Label>
            <Input
              value={timeline.title}
              onChange={(e) => setTimeline({ ...timeline, title: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1"
            />
          </div>
          {timeline.steps.map((step, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-lg">
              <div>
                <Label className="text-foreground">Étape {step.number} - Titre</Label>
                <Input
                  value={step.title}
                  onChange={(e) => {
                    const newSteps = [...timeline.steps];
                    newSteps[index] = { ...newSteps[index], title: e.target.value };
                    setTimeline({ ...timeline, steps: newSteps });
                  }}
                  className="bg-secondary border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-foreground">Sous-titre</Label>
                <Input
                  value={step.subtitle}
                  onChange={(e) => {
                    const newSteps = [...timeline.steps];
                    newSteps[index] = { ...newSteps[index], subtitle: e.target.value };
                    setTimeline({ ...timeline, steps: newSteps });
                  }}
                  className="bg-secondary border-border text-foreground mt-1"
                />
              </div>
            </div>
          ))}
          <div>
            <Label className="text-foreground">Note importante</Label>
            <Textarea
              value={timeline.note}
              onChange={(e) => setTimeline({ ...timeline, note: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1 resize-none"
              rows={2}
            />
          </div>
          <Button
            onClick={() => saveSection("timeline", timeline)}
            disabled={isSaving === "timeline"}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving === "timeline" ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enregistrement...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Enregistrer</>
            )}
          </Button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-6">
          Appel à l'action (CTA)
        </h3>
        <div className="space-y-4">
          <div>
            <Label className="text-foreground">Titre</Label>
            <Input
              value={cta.title}
              onChange={(e) => setCta({ ...cta, title: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1"
            />
          </div>
          <div>
            <Label className="text-foreground">Sous-titre</Label>
            <Textarea
              value={cta.subtitle}
              onChange={(e) => setCta({ ...cta, subtitle: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1 resize-none"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Bouton principal</Label>
              <Input
                value={cta.button_primary}
                onChange={(e) => setCta({ ...cta, button_primary: e.target.value })}
                className="bg-secondary border-border text-foreground mt-1"
              />
            </div>
            <div>
              <Label className="text-foreground">Bouton secondaire</Label>
              <Input
                value={cta.button_secondary}
                onChange={(e) => setCta({ ...cta, button_secondary: e.target.value })}
                className="bg-secondary border-border text-foreground mt-1"
              />
            </div>
          </div>
          <Button
            onClick={() => saveSection("cta", cta)}
            disabled={isSaving === "cta"}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving === "cta" ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enregistrement...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Enregistrer</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentSettingsForm;
