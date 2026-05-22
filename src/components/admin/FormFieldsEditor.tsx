import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings, SettingsMap, EngagementAmount } from "@/hooks/useSiteSettings";
import { Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react";

interface FormFieldsEditorProps {
  settings: SettingsMap;
}

const FormFieldsEditor = ({ settings }: FormFieldsEditorProps) => {
  const { updateSettingAsync } = useSiteSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [formFields, setFormFields] = useState(settings.form_fields);

  const addAmount = () => {
    setFormFields({
      ...formFields,
      engagement_amounts: [
        ...formFields.engagement_amounts,
        { value: "", label: "" },
      ],
    });
  };

  const removeAmount = (index: number) => {
    const newAmounts = formFields.engagement_amounts.filter((_, i) => i !== index);
    setFormFields({ ...formFields, engagement_amounts: newAmounts });
  };

  const updateAmount = (index: number, field: keyof EngagementAmount, value: string) => {
    const newAmounts = [...formFields.engagement_amounts];
    newAmounts[index] = { ...newAmounts[index], [field]: value };
    setFormFields({ ...formFields, engagement_amounts: newAmounts });
  };

  const moveAmount = (index: number, direction: "up" | "down") => {
    const newAmounts = [...formFields.engagement_amounts];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newAmounts.length) return;
    [newAmounts[index], newAmounts[newIndex]] = [newAmounts[newIndex], newAmounts[index]];
    setFormFields({ ...formFields, engagement_amounts: newAmounts });
  };

  const saveFormFields = async () => {
    setIsSaving(true);
    try {
      await updateSettingAsync({ key: "form_fields", value: formFields });
      toast({
        title: "Formulaire mis à jour",
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

  return (
    <div className="space-y-8">
      {/* Form Text Settings */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-6">
          Textes du formulaire
        </h3>
        <div className="space-y-4">
          <div>
            <Label className="text-foreground">Titre du formulaire</Label>
            <Input
              value={formFields.title}
              onChange={(e) => setFormFields({ ...formFields, title: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1"
            />
          </div>
          <div>
            <Label className="text-foreground">Description</Label>
            <Textarea
              value={formFields.description}
              onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1 resize-none"
              rows={2}
            />
          </div>
          <div>
            <Label className="text-foreground">Texte du bouton</Label>
            <Input
              value={formFields.submit_button}
              onChange={(e) => setFormFields({ ...formFields, submit_button: e.target.value })}
              className="bg-secondary border-border text-foreground mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground">Titre de succès</Label>
              <Input
                value={formFields.success_title}
                onChange={(e) => setFormFields({ ...formFields, success_title: e.target.value })}
                className="bg-secondary border-border text-foreground mt-1"
              />
            </div>
            <div>
              <Label className="text-foreground">Message de succès</Label>
              <Input
                value={formFields.success_message}
                onChange={(e) => setFormFields({ ...formFields, success_message: e.target.value })}
                className="bg-secondary border-border text-foreground mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Amounts */}
      <div className="glass rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Montants d'engagement
          </h3>
          <Button
            onClick={addAmount}
            variant="outline"
            size="sm"
            className="border-border text-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-3">
          {formFields.engagement_amounts.map((amount, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg"
            >
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveAmount(index, "up")}
                  disabled={index === 0}
                >
                  <GripVertical className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Valeur (ex: 50000)</Label>
                  <Input
                    value={amount.value}
                    onChange={(e) => updateAmount(index, "value", e.target.value)}
                    placeholder="50000"
                    className="bg-secondary border-border text-foreground mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Label affiché</Label>
                  <Input
                    value={amount.label}
                    onChange={(e) => updateAmount(index, "label", e.target.value)}
                    placeholder="50 000 CFA (1 part)"
                    className="bg-secondary border-border text-foreground mt-1"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeAmount(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {formFields.engagement_amounts.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Aucun montant configuré. Cliquez sur "Ajouter" pour en créer un.
          </p>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={saveFormFields}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer le formulaire
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FormFieldsEditor;
