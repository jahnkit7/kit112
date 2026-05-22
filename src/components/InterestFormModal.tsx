import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2 } from "@/components/icons/hugeicons";
import { useSetting } from "@/hooks/useSiteSettings";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  email: z.string().email("Adresse email invalide"),
  engagement_amount: z.string().min(1, "Veuillez sélectionner un montant"),
});

type FormData = z.infer<typeof formSchema>;

interface InterestFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultAmounts = [
  { value: "50000", label: "50 000 CFA (1 part)" },
  { value: "100000", label: "100 000 CFA (2 parts)" },
  { value: "200000", label: "200 000 CFA (4 parts)" },
  { value: "500000", label: "500 000 CFA (10 parts)" },
  { value: "libre", label: "Montant libre" },
];

const InterestFormModal = ({ open, onOpenChange }: InterestFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { data: formFields } = useSetting("form_fields");

  const title = formFields?.title || "Manifester mon intérêt";
  const description = formFields?.description || "Aucun paiement n'est demandé à ce stade. Nous vous contacterons pour la suite.";
  const successTitle = formFields?.success_title || "Merci pour votre intérêt !";
  const successMessage = formFields?.success_message || "Nous reviendrons vers vous très bientôt.";
  const submitButton = formFields?.submit_button || "Envoyer ma manifestation";
  const engagementAmounts = formFields?.engagement_amounts || defaultAmounts;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      engagement_amount: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("interest_manifestations")
        .insert({
          name: data.name,
          phone: data.phone,
          email: data.email,
          engagement_amount: data.engagement_amount,
        });

      if (error) throw error;

      setIsSuccess(true);
      form.reset();
      
      setTimeout(() => {
        setIsSuccess(false);
        onOpenChange(false);
      }, 2500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsSuccess(false);
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-primary mb-4 animate-scale-in" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              {successTitle}
            </h3>
            <p className="text-muted-foreground text-sm">
              {successMessage}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-foreground">
                {title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {description}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Nom complet</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Votre nom"
                          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Téléphone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+221 77 000 00 00"
                          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                          {...field}
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
                          type="email"
                          placeholder="votre@email.com"
                          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="engagement_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Engagement indicatif</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-secondary border-border text-foreground">
                            <SelectValue placeholder="Sélectionnez un montant" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border">
                          {engagementAmounts.map((amount) => (
                            <SelectItem key={amount.value} value={amount.value}>
                              {amount.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    submitButton
                  )}
                </Button>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InterestFormModal;
