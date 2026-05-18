import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Briefcase, Calendar } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const WORKSPACE_ID = "ws_default";

const INTEREST_OPTIONS = [
  "100% equity",
  "Controlling interest (>50%)",
  "Minority interest (<50%)",
  "Specific %",
];

const STANDARD_OF_VALUE_OPTIONS = [
  "Fair Market Value",
  "Fair Value",
  "Investment Value",
  "Other",
];

const ENGAGEMENT_TYPE_OPTIONS = [
  "Full appraisal",
  "Calculation engagement",
  "Estimate of value",
  "Preliminary analysis",
];

interface ProjectSummary {
  id: string;
  title?: string;
  entityName?: string | null;
  engagementType?: string | null;
  reviewStatus?: string | null;
  description?: string | null;
  valuationDate?: string | null;
  subjectInterest?: string | null;
  standardOfValue?: string | null;
}

function StatusBadge({ status }: { status?: string | null }) {
  const normalized = (status ?? "draft").toLowerCase();
  const variant: Record<string, { label: string; cls: string }> = {
    in_progress: { label: "In progress", cls: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
    complete: { label: "Complete", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
    draft: { label: "Draft", cls: "bg-muted text-muted-foreground border-border" },
    approved: { label: "Approved", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  };
  const v = variant[normalized] ?? variant.draft;
  return (
    <Badge variant="outline" className={`${v.cls} text-[10px] uppercase tracking-wide`}>
      {v.label}
    </Badge>
  );
}

function ProjectCard({ project, onClick }: { project: ProjectSummary; onClick: () => void }) {
  const { data: summary } = useQuery<{ totalSteps: number; checkedSteps: number }>({
    queryKey: ["/api/projects", project.id, "roadmap/summary"],
    queryFn: () => api.getRoadmapSummary(project.id),
  });

  const total = summary?.totalSteps ?? 0;
  const checked = summary?.checkedSteps ?? 0;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

  const companyName = project.entityName || project.title || "Untitled project";
  const valuationDate = project.valuationDate
    ? new Date(project.valuationDate).toLocaleDateString()
    : "—";

  return (
    <Card
      className="hover:border-primary/40 cursor-pointer transition-colors"
      onClick={onClick}
      data-testid={`project-card-${project.id}`}
    >
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base text-foreground truncate">
              {companyName}
            </h3>
            {project.standardOfValue && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {project.standardOfValue}
              </p>
            )}
          </div>
          <StatusBadge status={project.reviewStatus} />
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {project.engagementType && (
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {project.engagementType}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {valuationDate}
          </span>
        </div>

        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span className="tabular-nums">
              {checked} / {total} steps · {pct}%
            </span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Projects() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: projects = [], isLoading } = useQuery<ProjectSummary[]>({
    queryKey: ["/api/projects", WORKSPACE_ID],
    queryFn: () => api.getProjects(WORKSPACE_ID),
  });

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [interest, setInterest] = useState<string>(INTEREST_OPTIONS[0]);
  const [standardOfValue, setStandardOfValue] = useState<string>(STANDARD_OF_VALUE_OPTIONS[0]);
  const [valuationDate, setValuationDate] = useState("");
  const [engagementType, setEngagementType] = useState<string>(ENGAGEMENT_TYPE_OPTIONS[0]);
  const [notes, setNotes] = useState("");

  function resetForm() {
    setCompanyName("");
    setInterest(INTEREST_OPTIONS[0]);
    setStandardOfValue(STANDARD_OF_VALUE_OPTIONS[0]);
    setValuationDate("");
    setEngagementType(ENGAGEMENT_TYPE_OPTIONS[0]);
    setNotes("");
  }

  const createMutation = useMutation({
    mutationFn: async () => {
      const body = {
        workspaceId: WORKSPACE_ID,
        title: `${companyName} — ${standardOfValue}`,
        entityName: companyName,
        engagementType,
        reviewStatus: "draft",
        description: notes || null,
        valuationDate: valuationDate || null,
        subjectInterest: interest,
        standardOfValue,
      };
      const res = await api.createProject(body);
      return res.json();
    },
    onSuccess: (newProj: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", WORKSPACE_ID] });
      setDialogOpen(false);
      resetForm();
      toast({ title: "Project created", description: companyName });
      if (newProj?.id) navigate(`/projects/${newProj.id}`);
    },
    onError: (err: any) => {
      toast({ title: "Could not create project", description: err.message, variant: "destructive" });
    },
  });

  function handleCreate() {
    if (!companyName.trim()) {
      toast({ title: "Company name is required", variant: "destructive" });
      return;
    }
    createMutation.mutate();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your private-company valuation engagements through the standard 9-phase roadmap.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="new-project-button">
          <Plus className="w-4 h-4 mr-2" />
          New project
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading projects…</div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <Briefcase className="w-10 h-10 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="font-medium">No projects yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first valuation project to get started with the roadmap.
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create your first project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              onClick={() => navigate(`/projects/${p.id}`)}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>
              The standard 9-phase valuation roadmap will be created automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="company">Subject company name *</Label>
              <Input
                id="company"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="Acme Manufacturing, Inc."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Interest being valued</Label>
                <Select value={interest} onValueChange={setInterest}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INTEREST_OPTIONS.map(o => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Standard of value</Label>
                <Select value={standardOfValue} onValueChange={setStandardOfValue}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STANDARD_OF_VALUE_OPTIONS.map(o => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="vdate">Valuation date</Label>
                <Input
                  id="vdate"
                  type="date"
                  value={valuationDate}
                  onChange={e => setValuationDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Engagement type</Label>
                <Select value={engagementType} onValueChange={setEngagementType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ENGAGEMENT_TYPE_OPTIONS.map(o => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Description / notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Optional context, scope notes, or anything you want to remember about this engagement."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating…" : "Create project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
