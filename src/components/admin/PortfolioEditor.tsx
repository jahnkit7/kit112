import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings, SettingsMap } from "@/hooks/useSiteSettings";
import { Loader2, Save, Trash2, Upload, ImagePlus } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  display_order: number;
}

interface Props {
  settings: SettingsMap;
}

const PortfolioEditor = ({ settings }: Props) => {
  const { updateSettingAsync } = useSiteSettings();
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingMeta, setIsSavingMeta] = useState(false);

  const [title, setTitle] = useState(settings.portfolio?.title || "Portfolio");
  const [subtitle, setSubtitle] = useState(settings.portfolio?.subtitle || "");

  const { data: items, isLoading } = useQuery({
    queryKey: ["portfolio-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PortfolioItem[];
    },
  });

  const refetch = () => qc.invalidateQueries({ queryKey: ["portfolio-items"] });

  const updateItem = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<PortfolioItem> }) => {
      const { error } = await supabase.from("portfolio_items").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => refetch(),
  });

  const deleteItem = useMutation({
    mutationFn: async (item: PortfolioItem) => {
      // Try to remove image from bucket
      const path = item.image_url.split("/portfolio/")[1];
      if (path) await supabase.storage.from("portfolio").remove([path]);
      const { error } = await supabase.from("portfolio_items").delete().eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      refetch();
      toast({ title: "Projet supprimé" });
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploading(true);
    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 10 * 1024 * 1024) {
          toast({ title: `${file.name} trop volumineux`, description: "Max 10 Mo", variant: "destructive" });
          continue;
        }
        const ext = file.name.split(".").pop();
        const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("portfolio").upload(name, file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(name);
        const { error: insErr } = await supabase.from("portfolio_items").insert({
          title: file.name.replace(/\.[^.]+$/, ""),
          image_url: publicUrl,
          display_order: 0,
        });
        if (insErr) throw insErr;
      }
      toast({ title: "Images téléchargées" });
      refetch();
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur d'upload", variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const saveMeta = async () => {
    setIsSavingMeta(true);
    try {
      await updateSettingAsync({ key: "portfolio", value: { title, subtitle } });
      toast({ title: "Section mise à jour" });
    } finally {
      setIsSavingMeta(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="font-display text-xl font-semibold text-foreground">Section Portfolio</h3>
        <div>
          <Label className="text-foreground">Titre</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-secondary border-border text-foreground mt-1" />
        </div>
        <div>
          <Label className="text-foreground">Sous-titre</Label>
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="bg-secondary border-border text-foreground mt-1" />
        </div>
        <Button onClick={saveMeta} disabled={isSavingMeta} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {isSavingMeta ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enregistrement...</> : <><Save className="w-4 h-4 mr-2" /> Enregistrer</>}
        </Button>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-semibold text-foreground">Projets ({items?.length || 0})</h3>
          <div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={isUploading} className="border-border">
              {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Upload...</> : <><Upload className="w-4 h-4 mr-2" /> Ajouter des images</>}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
        ) : !items || items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ImagePlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
            Aucun projet. Téléchargez vos premières images.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="p-3 bg-secondary/50 rounded-lg border border-border space-y-3">
                <div className="flex gap-3">
                  <img src={item.image_url} alt={item.title} className="w-24 h-24 object-cover rounded-md bg-secondary flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Input
                      value={item.title}
                      onChange={(e) => updateItem.mutate({ id: item.id, patch: { title: e.target.value } })}
                      className="bg-secondary border-border text-foreground h-8 text-sm"
                      placeholder="Titre"
                    />
                    <Input
                      value={item.category || ""}
                      onChange={(e) => updateItem.mutate({ id: item.id, patch: { category: e.target.value } })}
                      className="bg-secondary border-border text-foreground h-8 text-sm"
                      placeholder="Catégorie"
                    />
                    <Input
                      type="number"
                      value={item.display_order}
                      onChange={(e) => updateItem.mutate({ id: item.id, patch: { display_order: parseInt(e.target.value) || 0 } })}
                      className="bg-secondary border-border text-foreground h-8 text-sm"
                      placeholder="Ordre"
                    />
                  </div>
                </div>
                <Textarea
                  value={item.description || ""}
                  onChange={(e) => updateItem.mutate({ id: item.id, patch: { description: e.target.value } })}
                  className="bg-secondary border-border text-foreground resize-none text-sm"
                  rows={2}
                  placeholder="Description"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteItem.mutate(item)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioEditor;
