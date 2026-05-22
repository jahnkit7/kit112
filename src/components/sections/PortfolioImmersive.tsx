import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSetting } from "@/hooks/useSiteSettings";
import Reveal from "@/components/Reveal";
import { ArrowUpRight } from "@/components/icons/hugeicons";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  tags: string[] | null;
  year: string | null;
  role: string | null;
  display_order: number;
}

const PortfolioImmersive = () => {
  const { data: meta } = useSetting("portfolio");
  const [filter, setFilter] = useState("Tous");
  const { data: items = [] } = useQuery({
    queryKey: ["portfolio-items-public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("portfolio_items").select("*").order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as PortfolioItem[];
    },
  });

  const categories = useMemo(() => ["Tous", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean))) as string[]], [items]);
  const filtered = filter === "Tous" ? items : items.filter((item) => item.category === filter);

  return (
    <section id="portfolio" className="py-20 sm:py-28 overflow-hidden">
      <div className="container">
        <Reveal>
          <div className="mb-10 sm:mb-14">
            <h2 className="mega-type text-[clamp(4.4rem,16vw,12rem)] uppercase">
              portfolio<span className="text-primary-deep">.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {meta?.subtitle || "Une galerie de projets construits entre produit, marque, interface et exécution visuelle."}
            </p>
          </div>
        </Reveal>

        {categories.length > 1 && (
          <Reveal delay={80}>
            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                    filter === category ? "bg-foreground text-background" : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((item, index) => (
            <Reveal key={item.id} delay={index * 55}>
              <article className={`group relative overflow-hidden rounded-[1.8rem] soft-card ${index % 3 === 0 ? "sm:row-span-2" : ""}`}>
                <div className="relative aspect-[4/5] sm:aspect-[4/4.8] overflow-hidden bg-secondary">
                  <img src={item.image_url} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/72 via-foreground/8 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-background">
                  <div className="mb-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.16em] text-background/72">
                    {item.category && <span>{item.category}</span>}
                    {item.year && <span>{item.year}</span>}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold leading-none">{item.title}</h3>
                  {item.description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-background/72">{item.description}</p>}
                </div>
                <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioImmersive;