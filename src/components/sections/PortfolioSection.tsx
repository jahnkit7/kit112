import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSetting } from "@/hooks/useSiteSettings";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  display_order: number;
}

const PortfolioSection = () => {
  const { data: portfolio } = useSetting("portfolio");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  const { data: items } = useQuery({
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

  const title = portfolio?.title || "Portfolio";
  const subtitle = portfolio?.subtitle || "";

  if (!items || items.length === 0) return null;

  return (
    <section id="portfolio" className="py-20 border-t border-border/50">
      <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
        {title}
      </h3>
      {subtitle && (
        <p className="text-muted-foreground mb-10">{subtitle}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className="group relative aspect-square rounded-xl overflow-hidden bg-secondary border border-border hover:border-primary transition-all"
          >
            <img
              src={item.image_url}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-left">
              <h4 className="font-display font-semibold text-foreground text-sm">
                {item.title}
              </h4>
              {item.category && (
                <span className="text-xs text-primary">{item.category}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl bg-card border-border">
          {selected && (
            <div className="space-y-4">
              <img
                src={selected.image_url}
                alt={selected.title}
                className="w-full rounded-lg max-h-[70vh] object-contain bg-secondary"
              />
              <div>
                <h4 className="font-display text-xl font-semibold text-foreground">
                  {selected.title}
                </h4>
                {selected.category && (
                  <span className="text-sm text-primary">{selected.category}</span>
                )}
                {selected.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {selected.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PortfolioSection;
