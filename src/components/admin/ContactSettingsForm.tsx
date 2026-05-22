import { useState } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings, SettingsMap, ContactSettings } from "@/hooks/useSiteSettings";
import { Loader2, Save } from "lucide-react";

const contactSchema = z.object({
  whatsapp_number: z.string().min(1, "Le numéro WhatsApp est requis"),
  whatsapp_message: z.string().min(1, "Le message WhatsApp est requis"),
  email: z.string().email("Email invalide"),
  linkedin_url: z.string().url("URL LinkedIn invalide"),
});

interface ContactSettingsFormProps {
  settings: SettingsMap;
}

const ContactSettingsForm = ({ settings }: ContactSettingsFormProps) => {
  const { updateSettingAsync, isUpdating } = useSiteSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ContactSettings>({
    resolver: zodResolver(contactSchema),
    defaultValues: settings.contact,
  });

  const onSubmit = async (data: ContactSettings) => {
    setIsSaving(true);
    try {
      await updateSettingAsync({ key: "contact", value: data });
      toast({
        title: "Contact mis à jour",
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
    <div className="glass rounded-xl p-6">
      <h3 className="font-display text-xl font-semibold text-foreground mb-6">
        Informations de contact
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="whatsapp_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Numéro WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="221770000000"
                    className="bg-secondary border-border text-foreground"
                  />
                </FormControl>
                <FormDescription className="text-muted-foreground text-xs">
                  Format international sans le +, ex: 221770000000
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp_message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Message WhatsApp pré-rempli</FormLabel>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="bg-secondary border-border text-foreground"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">URL LinkedIn</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="url"
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
  );
};

export default ContactSettingsForm;
