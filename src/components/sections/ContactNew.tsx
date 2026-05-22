import { useSetting } from "@/hooks/useSiteSettings";
import Reveal from "@/components/Reveal";
import { ArrowUpRight, Mail, MessageCircle, Linkedin } from "@/components/icons/hugeicons";

const ContactNew = () => {
  const { data: contact } = useSetting("contact");
  const whatsapp = contact?.whatsapp_number || "+221781221670";
  const email = contact?.email || "jahnkit@live.com";
  const linkedin = contact?.linkedin_url || "#";
  const waMsg = encodeURIComponent(contact?.whatsapp_message || "Bonjour, j'aimerais discuter d'un projet.");
  const waLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${waMsg}`;

  const channels = [
    { icon: MessageCircle, label: "WhatsApp", value: whatsapp, href: waLink },
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    { icon: Linkedin, label: "LinkedIn", value: "Connecter", href: linkedin },
  ];

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      <div className="container max-w-5xl">
        <div className="relative rounded-3xl glass overflow-hidden p-8 sm:p-14">
          <div aria-hidden className="pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full bg-primary/15 blur-[100px]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />

          <Reveal>
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-primary mb-5">
                <span className="h-px w-8 bg-primary/60" />
                Contact
              </div>
              <h2 className="font-display text-4xl sm:text-6xl text-balance max-w-3xl text-gradient">
                Un projet à structurer, déployer ou repenser ?
              </h2>
              <p className="mt-5 max-w-xl text-muted-foreground text-pretty">
                Choisissez votre canal préféré. Réponse rapide, conversation directe, pas de formulaire interminable.
              </p>
            </div>
          </Reveal>

          <div className="relative mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {channels.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.label} delay={i * 80}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group relative block rounded-2xl bg-card/40 ring-1 ring-border-strong/40 p-6 hover:ring-primary/30 hover:bg-card/60 transition-all"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{c.label}</div>
                    <div className="mt-1 font-display text-lg text-foreground truncate">{c.value}</div>
                  </a>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={300}>
            <div className="relative mt-12 flex items-center gap-3 text-xs text-muted-foreground/80">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-primary/50 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Consultations stratégiques · audits produit · accompagnement opérationnel
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactNew;
