import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { api } from "@/lib/api";
import { useWorkspace } from "@/lib/workspace-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, BookOpen, GitBranch, Shield, AlertTriangle, FileText, Library, MessageSquare, StickyNote, BookMarked, FolderOpen } from "lucide-react";

const ENTITY_ICONS: Record<string, any> = {
  project: FolderOpen,
  playbook: BookOpen,
  framework: GitBranch,
  principle: Shield,
  antipattern: AlertTriangle,
  template: FileText,
  reference_case: Library,
  qa: MessageSquare,
  note: StickyNote,
  lesson: BookMarked,
};

const ENTITY_COLORS: Record<string, string> = {
  project: "text-blue-400",
  playbook: "text-purple-400",
  framework: "text-cyan-400",
  principle: "text-emerald-400",
  antipattern: "text-amber-400",
  template: "text-indigo-400",
  reference_case: "text-sky-400",
  qa: "text-violet-400",
  note: "text-yellow-400",
  lesson: "text-rose-400",
};

const ENTITY_HREF: Record<string, (item: any) => string> = {
  project: (i) => `/projects/${i.id}`,
  playbook: (i) => `/playbooks/${i.id}`,
  framework: (i) => `/frameworks/${i.id}`,
  principle: (i) => `/principles`,
  antipattern: (i) => `/anti-patterns`,
  template: (i) => `/reasoning-templates/${i.id}`,
  reference_case: (i) => `/reference-cases/${i.caseId ?? i.id}`,
  qa: (i) => `/qa`,
  note: (i) => `/notes`,
  lesson: (i) => `/lessons`,
};

export default function SearchPage() {
  const { workspaceId } = useWorkspace();
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [includeRef, setIncludeRef] = useState(true);

  const { data: results, isLoading, isFetching } = useQuery({
    queryKey: ["/api/search", q, workspaceId, typeFilter, includeRef],
    queryFn: () =>
      api.search(q, {
        workspaceId: workspaceId ?? undefined,
        type: typeFilter === "all" ? undefined : typeFilter,
        includeReferenceCases: includeRef,
      }),
    enabled: q.trim().length >= 2,
  });

  const hits: any[] = results?.results ?? [];
  const grouped: Record<string, any[]> = {};
  for (const item of hits) {
    const type = item.type ?? "other";
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(item);
  }

  return (
    <div className="space-y-6 max-w-3xl" data-testid="page-search">
      <div>
        <h1 className="text-xl font-semibold">Global Search</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Search across playbooks, frameworks, principles, templates, projects, and reference cases</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search everything... (min 2 characters)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          data-testid="input-search-global"
          autoFocus
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Type:</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 h-8 text-xs" data-testid="select-type-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
              <SelectItem value="playbook">Playbooks</SelectItem>
              <SelectItem value="framework">Frameworks</SelectItem>
              <SelectItem value="principle">Principles</SelectItem>
              <SelectItem value="antipattern">Anti-Patterns</SelectItem>
              <SelectItem value="template">Templates</SelectItem>
              <SelectItem value="reference_case">Reference Cases</SelectItem>
              <SelectItem value="qa">Q&A</SelectItem>
              <SelectItem value="note">Notes</SelectItem>
              <SelectItem value="lesson">Lessons</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="include-ref"
            checked={includeRef}
            onCheckedChange={setIncludeRef}
            data-testid="switch-include-reference-cases"
          />
          <Label htmlFor="include-ref" className="text-xs text-muted-foreground">Include reference cases</Label>
        </div>
      </div>

      {/* Results */}
      {q.trim().length < 2 ? (
        <div className="text-center py-16">
          <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Type at least 2 characters to search</p>
        </div>
      ) : isLoading || isFetching ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : hits.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No results for "<strong>{q}</strong>"</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">{hits.length} result{hits.length !== 1 ? "s" : ""} found</p>
          {Object.entries(grouped).map(([type, items]) => {
            const Icon = ENTITY_ICONS[type] ?? FileText;
            const color = ENTITY_COLORS[type] ?? "text-slate-400";
            return (
              <div key={type} data-testid={`search-group-${type}`}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Icon className={`h-3 w-3 ${color}`} />
                  {type.replace(/_/g, " ")} ({items.length})
                </p>
                <div className="space-y-1">
                  {items.map((item: any) => {
                    const href = ENTITY_HREF[type]?.(item) ?? "#";
                    const Icon2 = ENTITY_ICONS[type] ?? FileText;
                    const color2 = ENTITY_COLORS[type] ?? "text-slate-400";
                    return (
                      <Link key={`${type}-${item.id}`} href={href}>
                        <Card className="cursor-pointer hover:border-slate-600 transition-colors" data-testid={`search-result-${item.id}`}>
                          <CardContent className="p-3 flex items-start gap-2">
                            <Icon2 className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${color2}`} />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground truncate">{item.title ?? item.question ?? item.id}</p>
                              {(item.description || item.body) && (
                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                  {item.description ?? item.body}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs flex-shrink-0 capitalize">{type.replace(/_/g," ")}</Badge>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
