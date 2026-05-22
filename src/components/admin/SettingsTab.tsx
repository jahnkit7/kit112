import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Loader2 } from "lucide-react";
import ProfileSettingsForm from "./ProfileSettingsForm";
import ContactSettingsForm from "./ContactSettingsForm";
import ContentSettingsForm from "./ContentSettingsForm";
import FormFieldsEditor from "./FormFieldsEditor";
import SkillsEditor from "./SkillsEditor";
import ExperiencesEditor from "./ExperiencesEditor";
import PortfolioEditor from "./PortfolioEditor";

const SettingsTab = () => {
  const { settings, isLoading } = useSiteSettings();
  const [activeTab, setActiveTab] = useState("profile");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Impossible de charger les paramètres.
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="flex flex-wrap w-full max-w-4xl bg-secondary h-auto">
        <TabsTrigger value="profile" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Profil</TabsTrigger>
        <TabsTrigger value="experiences" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Expériences</TabsTrigger>
        <TabsTrigger value="portfolio" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Portfolio</TabsTrigger>
        <TabsTrigger value="skills" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Compétences</TabsTrigger>
        <TabsTrigger value="content" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contenu</TabsTrigger>
        <TabsTrigger value="structure" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Structure</TabsTrigger>
        <TabsTrigger value="form" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Formulaire</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-8">
        <ProfileSettingsForm settings={settings} />
        <ContactSettingsForm settings={settings} />
      </TabsContent>

      <TabsContent value="experiences">
        <ExperiencesEditor settings={settings} />
      </TabsContent>

      <TabsContent value="portfolio">
        <PortfolioEditor settings={settings} />
      </TabsContent>

      <TabsContent value="skills">
        <SkillsEditor settings={settings} />
      </TabsContent>

      <TabsContent value="content">
        <ContentSettingsForm settings={settings} />
      </TabsContent>

      <TabsContent value="structure">
        <ContentSettingsForm settings={settings} section="structure" />
      </TabsContent>

      <TabsContent value="form">
        <FormFieldsEditor settings={settings} />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTab;
