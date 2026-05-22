import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings, SettingsMap, ProfileSettings } from "@/hooks/useSiteSettings";
import { Loader2, Save } from "lucide-react";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import LivePreview from "./LivePreview";

const profileSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  title: z.string().min(1, "Le titre est requis"),
  tagline: z.string().min(1, "Le tagline est requis"),
  status_text: z.string().min(1, "Le texte de statut est requis"),
  photo_url: z.string().nullable().optional(),
});

interface ProfileSettingsFormProps {
  settings: SettingsMap;
}

const ProfileSettingsForm = ({ settings }: ProfileSettingsFormProps) => {
  const { updateSettingAsync, isUpdating } = useSiteSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(settings.profile?.photo_url || null);

  const form = useForm<ProfileSettings>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...settings.profile,
      photo_url: settings.profile?.photo_url || null,
    },
  });

  const watchedValues = form.watch();

  const previewData = {
    name: watchedValues.name,
    title: watchedValues.title,
    tagline: watchedValues.tagline,
    status_text: watchedValues.status_text,
    photo_url: photoUrl,
  };

  const handlePhotoChange = (url: string | null) => {
    setPhotoUrl(url);
    form.setValue("photo_url", url);
  };

  const onSubmit = async (data: ProfileSettings) => {
    setIsSaving(true);
    try {
      await updateSettingAsync({ key: "profile", value: { ...data, photo_url: photoUrl } });
      toast({
        title: "Profil mis à jour",
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass rounded-xl p-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-6">
          Informations du profil
        </h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo Upload */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Photo de profil
              </label>
              <ProfilePhotoUpload
                currentPhotoUrl={photoUrl}
                onPhotoChange={handlePhotoChange}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Nom</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-secondary border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Titre / Profession</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-secondary border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Tagline</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-secondary border-border text-foreground resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Texte de statut (badge)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-secondary border-border text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSaving || isUpdating}
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
                  Enregistrer
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-1">
        <LivePreview profileData={previewData} />
      </div>
    </div>
  );
};

export default ProfileSettingsForm;
