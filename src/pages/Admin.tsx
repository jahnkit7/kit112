import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { LogOut, RefreshCw, Download, ArrowLeft, Users, AlertCircle, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import SettingsTab from "@/components/admin/SettingsTab";

interface InterestManifestation {
  id: string;
  name: string;
  phone: string;
  email: string;
  engagement_amount: string;
  created_at: string;
}

const Admin = () => {
  const [interests, setInterests] = useState<InterestManifestation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("manifestations");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    checkAuthAndFetch();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuthAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate("/auth");
      return;
    }

    // Check if user is admin
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    setIsAdmin(true);
    fetchInterests();
  };

  const fetchInterests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("interest_manifestations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInterests(data || []);
    } catch (error) {
      console.error("Error fetching interests:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const formatAmount = (amount: string) => {
    if (amount === "libre") return "Montant libre";
    return `${parseInt(amount).toLocaleString("fr-FR")} CFA`;
  };

  const exportCSV = () => {
    const headers = ["Nom", "Téléphone", "Email", "Engagement", "Date"];
    const rows = interests.map((i) => [
      i.name,
      i.phone,
      i.email,
      formatAmount(i.engagement_amount),
      format(new Date(i.created_at), "dd/MM/yyyy HH:mm", { locale: fr }),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `manifestations_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 dark">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Accès refusé
          </h1>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas les droits administrateur pour accéder à cette page.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" className="border-border">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au site
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-2 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au site
            </Link>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Tableau de bord
            </h1>
            <p className="text-muted-foreground">
              Gestion du site et des manifestations d'intérêt
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md bg-secondary">
            <TabsTrigger 
              value="manifestations" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="w-4 h-4 mr-2" />
              Manifestations
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manifestations" className="space-y-6">
            {/* Stats */}
            <div className="flex gap-3 mb-4">
              <Button
                onClick={fetchInterests}
                variant="outline"
                className="border-border"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Actualiser
              </Button>
              <Button
                onClick={exportCSV}
                variant="outline"
                className="border-border"
                disabled={interests.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-display font-bold text-foreground">
                      {interests.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Manifestations
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="text-2xl font-display font-bold text-primary">
                  {interests
                    .filter((i) => i.engagement_amount !== "libre")
                    .reduce((sum, i) => sum + parseInt(i.engagement_amount), 0)
                    .toLocaleString("fr-FR")}{" "}
                  CFA
                </div>
                <div className="text-sm text-muted-foreground">
                  Engagement total indicatif
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="glass rounded-xl overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center text-muted-foreground">
                  Chargement...
                </div>
              ) : interests.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  Aucune manifestation d'intérêt pour le moment.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-secondary/50">
                      <TableHead className="text-foreground">Nom</TableHead>
                      <TableHead className="text-foreground">Téléphone</TableHead>
                      <TableHead className="text-foreground">Email</TableHead>
                      <TableHead className="text-foreground">Engagement</TableHead>
                      <TableHead className="text-foreground">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interests.map((interest) => (
                      <TableRow key={interest.id} className="border-border hover:bg-secondary/50">
                        <TableCell className="font-medium text-foreground">
                          {interest.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {interest.phone}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {interest.email}
                        </TableCell>
                        <TableCell className="text-primary font-medium">
                          {formatAmount(interest.engagement_amount)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(interest.created_at), "dd MMM yyyy à HH:mm", {
                            locale: fr,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
