import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const links = [
  { href: "#expertise", label: "Expertise" },
  { href: "#vision", label: "Vision" },
  { href: "#portfolio", label: "Projets" },
  { href: "#parcours", label: "Parcours" },
  { href: "#contact", label: "Contact" },
];

const SiteNav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-4 sm:py-6"
      }`}
    >
      <div className="container">
        <nav
          className={`flex items-center justify-between rounded-full px-3 sm:px-5 py-2 transition-all duration-500 ${
            scrolled ? "bg-background/88 backdrop-blur-xl shadow-[0_18px_45px_-35px_hsl(var(--foreground)/0.5)] ring-1 ring-border" : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative inline-flex h-7 w-9 items-center justify-center">
              <span className="h-4 w-4 rounded-full bg-foreground" />
              <span className="-ml-1 h-4 w-4 rounded-full bg-foreground" />
            </span>
            <span className="font-display text-sm sm:text-base font-semibold text-foreground">
              Marie Janvier Kitcho
            </span>
          </Link>
          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-foreground/[0.06]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background hover:bg-foreground/88 transition-colors"
          >
            Discuter
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default SiteNav;
