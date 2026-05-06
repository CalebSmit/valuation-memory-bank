import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Bell, User, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/workspaces": "Workspaces",
  "/projects": "Projects",
  "/playbooks": "Methodology Playbooks",
  "/frameworks": "Decision Frameworks",
  "/principles": "Valuation Principles",
  "/anti-patterns": "Anti-Patterns",
  "/reasoning-templates": "Reasoning Templates",
  "/reference-cases": "Reference Case Library",
  "/sources": "Source Library",
  "/qa": "Q&A Bank",
  "/notes": "Notes",
  "/lessons": "Lessons Learned",
  "/search": "Search",
  "/settings": "Settings",
};

export function TopNav() {
  const [location, navigate] = useLocation();
  const [searchQ, setSearchQ] = useState("");

  const { data: user } = useQuery({ queryKey: ["/api/me"], queryFn: api.getMe });

  const title = Object.entries(PAGE_TITLES).find(([path]) => location === path || (path !== "/" && location.startsWith(path)))?.[1] ?? "Valuation Memory Bank";

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`);
    }
  }

  return (
    <div className="h-14 border-b border-border bg-card flex items-center gap-4 px-6 shrink-0">
      <h1 className="text-base font-semibold text-foreground">{title}</h1>
      <div className="flex-1" />
      <form onSubmit={handleSearchSubmit} className="relative w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Search knowledge..."
          className="pl-8 h-8 text-xs bg-muted border-border"
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          data-testid="topnav-search"
        />
      </form>
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
          <User className="w-3.5 h-3.5" />
          <span>{user?.name ?? "Demo Analyst"}</span>
        </div>
      </div>
    </div>
  );
}
