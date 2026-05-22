import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface ProfileSettings {
  name: string;
  title: string;
  tagline: string;
  status_text: string;
  photo_url?: string | null;
}

export interface ContactSettings {
  whatsapp_number: string;
  whatsapp_message: string;
  email: string;
  linkedin_url: string;
}

export interface HeroSettings {
  title: string;
  highlight: string;
  subtitle: string;
}

export interface AboutSettings {
  title: string;
  paragraphs: string[];
}

export interface SkillItem {
  icon: string;
  title: string;
  description: string;
}

export interface SkillsSettings {
  title: string;
  items: SkillItem[];
}

export interface FeatureItem {
  icon: string;
  text: string;
}

export interface ProjectSettings {
  badge: string;
  title: string;
  description: string;
  features: FeatureItem[];
}

export interface TimelineStep {
  number: number;
  title: string;
  subtitle: string;
}

export interface TimelineSettings {
  title: string;
  steps: TimelineStep[];
  note: string;
}

export interface StructureSettings {
  title: string;
  total_parts: number;
  founder_percent: number;
  collective_percent: number;
  part_price: number;
  founder_name: string;
  explanation_1: string;
  explanation_2: string;
  investment_note: string;
}

export interface GuaranteeItem {
  icon: string;
  text: string;
}

export interface TrustSettings {
  title: string;
  guarantees: GuaranteeItem[];
}

export interface CTASettings {
  title: string;
  subtitle: string;
  button_primary: string;
  button_secondary: string;
}

export interface EngagementAmount {
  value: string;
  label: string;
}

export interface FormFieldsSettings {
  title: string;
  description: string;
  success_title: string;
  success_message: string;
  submit_button: string;
  engagement_amounts: EngagementAmount[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location?: string;
  description?: string;
}

export interface ExperiencesSettings {
  title: string;
  items: ExperienceItem[];
}

export interface PortfolioSettings {
  title: string;
  subtitle: string;
}

export type SettingKey = 
  | "profile"
  | "contact"
  | "hero"
  | "about"
  | "skills"
  | "project"
  | "timeline"
  | "structure"
  | "trust"
  | "cta"
  | "form_fields"
  | "experiences"
  | "portfolio";

export type SettingsMap = {
  profile: ProfileSettings;
  contact: ContactSettings;
  hero: HeroSettings;
  about: AboutSettings;
  skills: SkillsSettings;
  project: ProjectSettings;
  timeline: TimelineSettings;
  structure: StructureSettings;
  trust: TrustSettings;
  cta: CTASettings;
  form_fields: FormFieldsSettings;
  experiences: ExperiencesSettings;
  portfolio: PortfolioSettings;
};

interface SiteSettingRow {
  id: string;
  setting_key: string;
  setting_value: Json;
  updated_at: string;
}

interface UpdateSettingParams {
  key: SettingKey;
  value: SettingsMap[SettingKey];
}

export const useSiteSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;

      const settingsMap: Partial<SettingsMap> = {};
      (data as SiteSettingRow[] | null)?.forEach((row) => {
        const key = row.setting_key as SettingKey;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        settingsMap[key] = row.setting_value as any;
      });

      return settingsMap as SettingsMap;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: UpdateSettingParams) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ setting_value: value as unknown as Json })
        .eq("setting_key", key);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });

  const getSetting = <K extends SettingKey>(key: K): SettingsMap[K] | undefined => {
    return settings?.[key];
  };

  return {
    settings,
    isLoading,
    error,
    getSetting,
    updateSetting: updateSettingMutation.mutate,
    updateSettingAsync: updateSettingMutation.mutateAsync,
    isUpdating: updateSettingMutation.isPending,
  };
};

// Hook for single setting
export const useSetting = <K extends SettingKey>(key: K) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["site-settings", key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", key)
        .maybeSingle();

      if (error) throw error;
      if (!data?.setting_value) return null;
      return data.setting_value as unknown as SettingsMap[K];
    },
    staleTime: 1000 * 60 * 5,
  });

  return { data, isLoading, error };
};
