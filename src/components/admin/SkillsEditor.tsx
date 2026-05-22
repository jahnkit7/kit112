import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings, SkillItem, SettingsMap } from "@/hooks/useSiteSettings";
import { Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react";
import { Globe, CreditCard, Palette, Rocket, Code, Shield, Zap, Heart } from "lucide-react";

const availableIcons = [
  { name: "Globe", component: Globe },
  { name: "CreditCard", component: CreditCard },
  { name: "Palette", component: Palette },
  { name: "Rocket", component: Rocket },
  { name: "Code", component: Code },
  { name: "Shield", component: Shield },
  { name: "Zap", component: Zap },
  { name: "Heart", component: Heart },
];

interface SkillsEditorProps {
  settings: SettingsMap;
  onPreviewChange?: (skills: { title: string; items: SkillItem[] }) => void;
}

const SkillsEditor = ({ settings, onPreviewChange }: SkillsEditorProps) => {
  const { updateSettingAsync } = useSiteSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [title, setTitle] = useState(settings.skills?.title || "Ce que je sais faire");
  const [skills, setSkills] = useState<SkillItem[]>(
    settings.skills?.items || []
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onPreviewChange?.({ title: newTitle, items: skills });
  };

  const handleSkillChange = (index: number, field: keyof SkillItem, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkills(newSkills);
    onPreviewChange?.({ title, items: newSkills });
  };

  const handleAddSkill = () => {
    const newSkills = [
      ...skills,
      { icon: "Globe", title: "Nouvelle compétence", description: "Description de la compétence" },
    ];
    setSkills(newSkills);
    onPreviewChange?.({ title, items: newSkills });
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
    onPreviewChange?.({ title, items: newSkills });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettingAsync({
        key: "skills",
        value: { title, items: skills },
      });
      toast({
        title: "Compétences mises à jour",
        description: "Les modifications ont été enregistrées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find((i) => i.name === iconName);
    return iconData?.component || Globe;
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-semibold text-foreground">
          Compétences
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddSkill}
          className="border-border hover:bg-secondary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-4">
        {/* Section Title */}
        <div>
          <Label className="text-foreground">Titre de la section</Label>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="bg-secondary border-border text-foreground mt-1"
          />
        </div>

        {/* Skills List */}
        <div className="space-y-4">
          {skills.map((skill, index) => {
            const IconComponent = getIconComponent(skill.icon);
            return (
              <div
                key={index}
                className="p-4 bg-secondary/50 rounded-lg border border-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      Compétence {index + 1}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-muted-foreground text-xs">Icône</Label>
                    <Select
                      value={skill.icon}
                      onValueChange={(value) => handleSkillChange(index, "icon", value)}
                    >
                      <SelectTrigger className="bg-secondary border-border mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon.name} value={icon.name}>
                            <div className="flex items-center gap-2">
                              <icon.component className="w-4 h-4" />
                              <span>{icon.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-muted-foreground text-xs">Titre</Label>
                    <Input
                      value={skill.title}
                      onChange={(e) => handleSkillChange(index, "title", e.target.value)}
                      className="bg-secondary border-border text-foreground mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground text-xs">Description</Label>
                  <Textarea
                    value={skill.description}
                    onChange={(e) => handleSkillChange(index, "description", e.target.value)}
                    className="bg-secondary border-border text-foreground mt-1 resize-none"
                    rows={2}
                  />
                </div>
              </div>
            );
          })}

          {skills.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune compétence définie. Cliquez sur "Ajouter" pour en créer une.
            </div>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer les compétences
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SkillsEditor;
