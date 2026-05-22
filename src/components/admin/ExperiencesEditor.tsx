import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings, ExperienceItem, SettingsMap } from "@/hooks/useSiteSettings";
import { Loader2, Save, Plus, Trash2, Briefcase } from "lucide-react";

interface Props {
  settings: SettingsMap;
}

const ExperiencesEditor = ({ settings }: Props) => {
  const { updateSettingAsync } = useSiteSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState(settings.experiences?.title || "Expérience professionnelle");
  const [items, setItems] = useState<ExperienceItem[]>(settings.experiences?.items || []);

  const update = (i: number, field: keyof ExperienceItem, value: string) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [field]: value };
    setItems(copy);
  };

  const add = () => {
    setItems([
      { role: "Nouveau poste", company: "Entreprise", period: "2024 - Aujourd'hui", location: "", description: "" },
      ...items,
    ]);
  };

  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setItems(copy);
  };

  const save = async () => {
    setIsSaving(true);
    try {
      await updateSettingAsync({ key: "experiences", value: { title, items } });
      toast({ title: "Expériences mises à jour" });
    } catch {
      toast({ title: "Erreur", description: "Sauvegarde impossible.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-semibold text-foreground">Expériences</h3>
        <Button type="button" variant="outline" size="sm" onClick={add} className="border-border">
          <Plus className="w-4 h-4 mr-2" /> Ajouter
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-foreground">Titre de la section</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-secondary border-border text-foreground mt-1"
          />
        </div>

        {items.map((item, i) => (
          <div key={i} className="p-4 bg-secondary/50 rounded-lg border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Expérience {i + 1}</span>
              </div>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => move(i, -1)} disabled={i === 0}>↑</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground text-xs">Poste</Label>
                <Input value={item.role} onChange={(e) => update(i, "role", e.target.value)} className="bg-secondary border-border text-foreground mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Entreprise</Label>
                <Input value={item.company} onChange={(e) => update(i, "company", e.target.value)} className="bg-secondary border-border text-foreground mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Période</Label>
                <Input value={item.period} onChange={(e) => update(i, "period", e.target.value)} className="bg-secondary border-border text-foreground mt-1" />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Lieu (optionnel)</Label>
                <Input value={item.location || ""} onChange={(e) => update(i, "location", e.target.value)} className="bg-secondary border-border text-foreground mt-1" />
              </div>
            </div>

            <div>
              <Label className="text-muted-foreground text-xs">Description</Label>
              <Textarea
                value={item.description || ""}
                onChange={(e) => update(i, "description", e.target.value)}
                className="bg-secondary border-border text-foreground mt-1 resize-none"
                rows={2}
              />
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucune expérience. Cliquez sur "Ajouter".
          </div>
        )}

        <Button onClick={save} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enregistrement...</> : <><Save className="w-4 h-4 mr-2" /> Enregistrer</>}
        </Button>
      </div>
    </div>
  );
};

export default ExperiencesEditor;
