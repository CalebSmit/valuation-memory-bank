import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace-context";
import {
  LayoutDashboard, FolderOpen, BookOpen, GitFork, Shield,
  AlertTriangle, FileText, Archive, Database, MessageSquare,
  StickyNote, Lightbulb, Search, Settings, ChevronDown,
  Building2, CheckSquare,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type NavItem = 
  | { href: string; label: string; icon: React.ElementType; badge?: string; divider?: never }
  | { divider: true; label: string; href?: never; icon?: never; badge?: never };

import { type ElementType } from "react";

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { divider: true, label: "Methodology" },
  { href: "/playbooks", label: "Playbooks", icon: BookOpen },
  { href: "/frameworks", label: "Frameworks", icon: GitFork },
  { href: "/principles", label: "Principles", icon: Shield },
  { href: "/anti-patterns", label: "Anti-Patterns", icon: AlertTriangle },
  { href: "/reasoning-templates", label: "Templates", icon: FileText },
  { divider: true, label: "Knowledge" },
  { href: "/sources", label: "Sources", icon: Database },
  { href: "/qa", label: "Q&A Bank", icon: MessageSquare },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/lessons", label: "Lessons", icon: Lightbulb },
  { divider: true, label: "Reference" },
  { href: "/reference-cases", label: "Reference Cases", icon: Archive, badge: "Library" },
  { divider: true, label: "Tools" },
  { href: "/search", label: "Search", icon: Search },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { activeWorkspaceId, setActiveWorkspaceId, workspaces, activeWorkspace } = useWorkspace();

  return (
    <div className="w-60 bg-card border-r border-border flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center shrink-0">
            <CheckSquare className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground leading-tight">Valuation<br />Memory Bank</span>
        </div>
      </div>

      {/* Workspace Switcher */}
      <div className="px-3 py-3 border-b border-border">
        <div className="text-xs text-muted-foreground mb-1 px-1">Workspace</div>
        {workspaces.length > 0 ? (
          <Select value={activeWorkspaceId} onValueChange={setActiveWorkspaceId}>
            <SelectTrigger className="h-8 text-xs bg-muted border-border" data-testid="workspace-switcher">
              <SelectValue placeholder="Select workspace" />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((ws: any) => (
                <SelectItem key={ws.id} value={ws.id} className="text-xs">
                  {ws.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-xs text-muted-foreground px-1">No workspaces</div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {navItems.map((item, i) => {
          if ("divider" in item && item.divider) {
            return (
              <div key={i} className="px-2 pt-4 pb-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
            );
          }
          if (item.divider) return null;
          const { href, icon: Icon } = item as { href: string; icon: React.ElementType; label: string; badge?: string };
          const isActive = location === href || (href !== "/dashboard" && location.startsWith(href));
          return (
            <Link key={href} href={href}>
              <div
                data-testid={`nav-${href.replace("/", "").replace("-", "_")}`}
                className={cn(
                  "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors cursor-pointer group",
                  isActive
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-[10px] h-4 px-1 py-0">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer notice */}
      <div className="px-3 py-3 border-t border-border">
        <div className="bg-muted/50 rounded-md p-2 text-[10px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground/70">Note:</strong> Calculations happen in Excel, firm models, or external tools. This app preserves methodology support.
        </div>
      </div>
    </div>
  );
}
