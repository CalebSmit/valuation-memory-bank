import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { api } from "@/lib/api";
import { useWorkspace } from "@/lib/workspace-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  BookOpen,
  Star,
  Activity,
  FileText,
  GitBranch,
  Shield,
  AlertTriangle,
  Clock,
  Plus,
  Library,
} from "lucide-react";

export default function Dashboard() {
  const { workspaceId } = useWorkspace();

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ["/api/projects", workspaceId],
    queryFn: () => api.getProjects(workspaceId),
  });

  const { data: playbooks = [], isLoading: loadingPlaybooks } = useQuery({
    queryKey: ["/api/playbooks", workspaceId],
    queryFn: () => api.getPlaybooks(workspaceId),
  });

  const { data: favorites = [], isLoading: loadingFavorites } = useQuery({
    queryKey: ["/api/favorites", workspaceId],
    queryFn: () => api.getFavorites(workspaceId),
  });

  const { data: activity = [], isLoading: loadingActivity } = useQuery({
    queryKey: ["/api/activity", workspaceId],
    queryFn: () => api.getActivity(workspaceId),
  });

  const { data: frameworks = [] } = useQuery({
    queryKey: ["/api/frameworks"],
    queryFn: () => api.getFrameworks(),
  });

  const { data: principles = [] } = useQuery({
    queryKey: ["/api/principles"],
    queryFn: () => api.getPrinciples(),
  });

  const { data: antipatterns = [] } = useQuery({
    queryKey: ["/api/anti-patterns"],
    queryFn: () => api.getAntipatterns(),
  });

  const statCards = [
    {
      label: "Active Projects",
      value: projects.length,
      icon: FolderOpen,
      href: "/projects",
      loading: loadingProjects,
      color: "text-blue-400",
    },
    {
      label: "Playbooks",
      value: playbooks.length,
      icon: BookOpen,
      href: "/playbooks",
      loading: loadingPlaybooks,
      color: "text-purple-400",
    },
    {
      label: "Frameworks",
      value: frameworks.length,
      icon: GitBranch,
      href: "/frameworks",
      loading: false,
      color: "text-cyan-400",
    },
    {
      label: "Principles",
      value: principles.length,
      icon: Shield,
      href: "/principles",
      loading: false,
      color: "text-emerald-400",
    },
    {
      label: "Anti-Patterns",
      value: antipatterns.length,
      icon: AlertTriangle,
      href: "/anti-patterns",
      loading: false,
      color: "text-amber-400",
    },
    {
      label: "Favorites",
      value: favorites.length,
      icon: Star,
      href: "/search",
      loading: loadingFavorites,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="space-y-6" data-testid="page-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your valuation knowledge workspace at a glance
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" data-testid="button-new-project">
            <Link href="/projects">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Project
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" data-testid="button-reference-cases">
            <Link href="/reference-cases">
              <Library className="h-3.5 w-3.5 mr-1.5" />
              Reference Cases
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((s) => (
          <Link href={s.href} key={s.label}>
            <Card
              className="cursor-pointer hover:border-slate-600 transition-colors"
              data-testid={`stat-card-${s.label.toLowerCase().replace(/ /g, "-")}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                {s.loading ? (
                  <Skeleton className="h-6 w-10 mb-1" />
                ) : (
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                )}
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card data-testid="card-recent-projects">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-blue-400" />
                Recent Projects
              </CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground">
                <Link href="/projects">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {loadingProjects ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No projects yet.</p>
                <Button asChild size="sm" variant="outline" className="mt-3">
                  <Link href="/projects">Create your first project</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-1">
                {projects.slice(0, 6).map((p: any) => (
                  <Link key={p.id} href={`/projects/${p.id}`}>
                    <div
                      className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent transition-colors cursor-pointer"
                      data-testid={`project-item-${p.id}`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.entityName ?? ""}</p>
                      </div>
                      {p.reviewStatus && (
                        <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                          {p.reviewStatus}
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card data-testid="card-recent-activity">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loadingActivity ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : activity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No activity yet.</p>
            ) : (
              <div className="space-y-1">
                {activity.slice(0, 8).map((a: any) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-2 px-2 py-1.5"
                    data-testid={`activity-item-${a.id}`}
                  >
                    <Clock className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-foreground">
                        <span className="font-medium capitalize">{a.action}</span>{" "}
                        <span className="text-muted-foreground">{a.entityType}</span>
                        {a.entityTitle && (
                          <span className="text-foreground truncate"> — {a.entityTitle}</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorites */}
        <Card data-testid="card-favorites">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loadingFavorites ? (
              <div className="space-y-2">
                {[1, 2].map((i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : favorites.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No favorites yet. Star items to pin them here.
              </p>
            ) : (
              <div className="space-y-1">
                {favorites.slice(0, 6).map((fav: any) => (
                  <div
                    key={fav.id}
                    className="flex items-center gap-2 px-2 py-1.5"
                    data-testid={`favorite-item-${fav.id}`}
                  >
                    <Star className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {fav.entityTitle ?? fav.entityId}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{fav.entityType}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card data-testid="card-quick-links">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              Knowledge Library
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Playbooks", href: "/playbooks", icon: BookOpen },
                { label: "Frameworks", href: "/frameworks", icon: GitBranch },
                { label: "Principles", href: "/principles", icon: Shield },
                { label: "Anti-Patterns", href: "/anti-patterns", icon: AlertTriangle },
                { label: "Templates", href: "/reasoning-templates", icon: FileText },
                { label: "Reference Cases", href: "/reference-cases", icon: Library },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <div
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent transition-colors cursor-pointer"
                    data-testid={`quick-link-${link.label.toLowerCase().replace(/ /g, "-")}`}
                  >
                    <link.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">{link.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
