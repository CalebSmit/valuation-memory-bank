import { Link, useLocation } from "wouter";
import { TrendingUp } from "lucide-react";

const NAV_ITEMS: { path: string; label: string; matchPrefix?: string }[] = [
  { path: "/projects", label: "Projects", matchPrefix: "/projects" },
  { path: "/roadmap", label: "Roadmap" },
  { path: "/settings", label: "Settings" },
];

function isActive(currentPath: string, item: { path: string; matchPrefix?: string }) {
  if (item.matchPrefix) {
    if (currentPath === "/" && item.matchPrefix === "/projects") return true;
    return currentPath === item.path || currentPath.startsWith(item.matchPrefix + "/");
  }
  return currentPath === item.path;
}

export function TopNav() {
  const [location] = useLocation();

  return (
    <header className="h-14 border-b border-border bg-background shrink-0">
      <div className="h-full px-6 flex items-center gap-8">
        <Link href="/projects" className="flex items-center gap-2 text-foreground hover:text-foreground/90 transition-colors">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="font-semibold tracking-tight">Valuation Roadmap</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const active = isActive(location, item);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={
                  "px-3 h-14 flex items-center text-sm transition-colors border-b-2 " +
                  (active
                    ? "text-primary font-medium border-primary"
                    : "text-muted-foreground hover:text-foreground border-transparent")
                }
                data-testid={`topnav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />
      </div>
    </header>
  );
}
