import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useWorkspace } from "@/lib/workspace-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Settings, User, Building2, Database, Shield, AlertTriangle, BookOpen, FileText, Library, Info,
} from "lucide-react";

export default function SettingsPage() {
  const { workspaceId } = useWorkspace();

  const { data: me } = useQuery({
    queryKey: ["/api/me"],
    queryFn: () => api.getMe(),
  });

  const { data: workspaces = [] } = useQuery({
    queryKey: ["/api/workspaces"],
    queryFn: () => api.getWorkspaces(),
  });

  const activeWorkspace = workspaces.find((w: any) => w.id === workspaceId);

  return (
    <div className="space-y-6 max-w-2xl" data-testid="page-settings">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Workspace and account configuration</p>
      </div>

      {/* User / Auth */}
      <Card data-testid="card-user-settings">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-blue-400" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Email</span>
            <span className="text-xs font-medium text-foreground">{me?.email ?? "demo@valuation-memory-bank.local"}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Name</span>
            <span className="text-xs font-medium text-foreground">{me?.name ?? "Demo Analyst"}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Role</span>
            <Badge variant="outline" className="text-xs">{me?.role ?? "analyst"}</Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Auth Mode</span>
            <Badge variant="outline" className="text-xs bg-amber-900/30 border-amber-700 text-amber-300">Mock / Local</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            This is a demo instance using mock authentication. To enable real auth, configure your auth provider in <code className="bg-slate-800 px-1 rounded text-xs">.env</code>.
          </p>
        </CardContent>
      </Card>

      {/* Active Workspace */}
      <Card data-testid="card-workspace-settings">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-purple-400" />
            Active Workspace
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Name</span>
            <span className="text-xs font-medium text-foreground">{activeWorkspace?.name ?? "My Workspace"}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">ID</span>
            <code className="text-xs font-mono text-muted-foreground">{workspaceId ?? "ws_default"}</code>
          </div>
          <div className="mt-2">
            <Button asChild variant="outline" size="sm" className="text-xs" data-testid="link-manage-workspaces">
              <Link href="/workspaces">Manage Workspaces</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data / Seed */}
      <Card data-testid="card-data-settings">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-400" />
            Data & Seed
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-blue-400" />
            <p>
              Seed data (playbooks, frameworks, principles, anti-patterns, templates, and the Dordt GSU 2025 reference case)
              is pre-loaded as read-only content. Clone any seed item to create an editable copy in your workspace.
            </p>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Storage</span>
            <span className="text-xs font-medium">SQLite (local / D1-compatible)</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Database file</span>
            <code className="text-xs font-mono text-muted-foreground">data.db</code>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Dordt GSU 2025</span>
            <div className="flex items-center gap-1">
              <Library className="h-3 w-3 text-blue-400" />
              <code className="text-xs font-mono text-muted-foreground">reference_cases.dordt_gsu_2025</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Constraint Confirmation */}
      <Card data-testid="card-constraints">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" />
            Scope Constraints
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {[
              { label: "No calculator routes", ok: true },
              { label: "No DCF / WACC / DLOM formula engine", ok: true },
              { label: "No sensitivity tables or scenario runners", ok: true },
              { label: "Dordt isolated as reference case only (case_id: dordt_gsu_2025)", ok: true },
              { label: "Blank project creation (no forced Dordt association)", ok: true },
              { label: "All seed items are read-only + clonable", ok: true },
              { label: "External model references are metadata-only", ok: true },
              { label: "AI integration is placeholder-only in MVP", ok: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-emerald-400 text-xs">✓</span>
                <span className="text-xs text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card data-testid="card-about">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Info className="h-4 w-4 text-slate-400" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Application</span>
            <span className="text-xs font-medium">Valuation Memory Bank</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Version</span>
            <Badge variant="outline" className="text-xs">v1.2 Final (MVP)</Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Stack</span>
            <span className="text-xs text-muted-foreground">Express + Vite + React + Tailwind + Drizzle + SQLite</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">PRD</span>
            <code className="text-xs font-mono text-muted-foreground">docs/valuation-memory-bank-prd-v1.2-final.md</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
