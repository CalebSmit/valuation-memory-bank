import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown, ChevronRight, Plus, Trash2, CheckCircle2, ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProjectShape {
  id: string;
  title?: string;
  entityName?: string | null;
  engagementType?: string | null;
  reviewStatus?: string | null;
  description?: string | null;
  valuationDate?: string | null;
  standardOfValue?: string | null;
  subjectInterest?: string | null;
}

interface Phase {
  id: string;
  title: string;
  sortOrder: number;
  isCollapsed?: boolean | null;
  projectId: string;
}

interface Step {
  id: string;
  phaseId: string;
  title: string;
  isChecked: boolean;
  status: string;
  notes: string | null;
  whyThisMatters: string | null;
  sortOrder: number;
}

const STATUS_OPTIONS: { value: string; label: string; cls: string }[] = [
  { value: "not_started", label: "Not started", cls: "bg-muted text-muted-foreground" },
  { value: "in_progress", label: "In progress", cls: "bg-blue-500/15 text-blue-300" },
  { value: "complete", label: "Complete", cls: "bg-emerald-500/15 text-emerald-300" },
  { value: "na", label: "N/A", cls: "bg-zinc-700/40 text-zinc-400 italic" },
];

function statusInfo(status: string) {
  return STATUS_OPTIONS.find(s => s.value === status) ?? STATUS_OPTIONS[0];
}

function StepRow({
  step,
  projectId,
  phaseId,
}: {
  step: Step;
  projectId: string;
  phaseId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(step.title);
  const [notesDraft, setNotesDraft] = useState(step.notes ?? "");

  useEffect(() => { setTitleDraft(step.title); }, [step.title]);
  useEffect(() => { setNotesDraft(step.notes ?? ""); }, [step.notes]);

  const update = useMutation({
    mutationFn: (patch: Partial<Step>) =>
      api.updateRoadmapStep(projectId, phaseId, step.id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "roadmap"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "roadmap/summary"] });
    },
  });

  const remove = useMutation({
    mutationFn: () => api.deleteRoadmapStep(projectId, phaseId, step.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "roadmap"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "roadmap/summary"] });
    },
  });

  const sInfo = statusInfo(step.status);
  const isNA = step.status === "na";
  const isInProgress = step.status === "in_progress";

  function commitTitle() {
    setEditingTitle(false);
    if (titleDraft.trim() && titleDraft !== step.title) {
      update.mutate({ title: titleDraft.trim() });
    } else {
      setTitleDraft(step.title);
    }
  }

  function commitNotes() {
    if (notesDraft !== (step.notes ?? "")) {
      update.mutate({ notes: notesDraft });
    }
  }

  return (
    <div
      className={
        "border-l-2 pl-4 py-2.5 " +
        (isInProgress ? "border-blue-500" : "border-transparent ") +
        (step.isChecked ? "opacity-60 " : "") +
        (isNA ? "italic opacity-50" : "")
      }
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={step.isChecked}
          onCheckedChange={(c) => {
            const checked = c === true;
            update.mutate({
              isChecked: checked,
              status: checked ? "complete" : (step.status === "complete" ? "not_started" : step.status),
            });
          }}
          className="mt-1"
          data-testid={`step-check-${step.id}`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            {editingTitle ? (
              <Input
                autoFocus
                value={titleDraft}
                onChange={e => setTitleDraft(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={e => {
                  if (e.key === "Enter") commitTitle();
                  if (e.key === "Escape") { setTitleDraft(step.title); setEditingTitle(false); }
                }}
                className="h-7 text-sm"
              />
            ) : (
              <button
                type="button"
                className={
                  "text-left text-sm flex-1 hover:text-primary transition-colors " +
                  (step.isChecked ? "line-through" : "")
                }
                onClick={() => setExpanded(!expanded)}
                onDoubleClick={() => setEditingTitle(true)}
              >
                {step.title}
              </button>
            )}

            <Select value={step.status} onValueChange={(v) => update.mutate({ status: v })}>
              <SelectTrigger className={`h-6 px-2 text-[10px] uppercase tracking-wide border-0 w-auto ${sInfo.cls}`}>
                <SelectValue>{sInfo.label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(o => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={() => remove.mutate()}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>

          {expanded && (
            <div className="mt-3 space-y-3 pt-2 border-t border-border/50">
              {step.whyThisMatters && (
                <div className="text-xs">
                  <div className="text-muted-foreground uppercase tracking-wide mb-1">Why this matters</div>
                  <p className="text-foreground/80 leading-relaxed">{step.whyThisMatters}</p>
                </div>
              )}
              <div className="text-xs">
                <div className="text-muted-foreground uppercase tracking-wide mb-1">Your notes</div>
                <Textarea
                  value={notesDraft}
                  onChange={e => setNotesDraft(e.target.value)}
                  onBlur={commitNotes}
                  placeholder="Add notes, decisions, sources, or open questions for this step…"
                  className="text-sm min-h-[80px]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PhaseCard({
  phase,
  projectId,
}: {
  phase: Phase;
  projectId: string;
}) {
  const [collapsed, setCollapsed] = useState(!!phase.isCollapsed);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(phase.title);

  useEffect(() => { setTitleDraft(phase.title); }, [phase.title]);

  const { data: steps = [] } = useQuery<Step[]>({
    queryKey: ["/api/projects", projectId, "roadmap", phase.id, "steps"],
    queryFn: () => api.getRoadmapSteps(projectId, phase.id),
  });

  const updatePhase = useMutation({
    mutationFn: (patch: Partial<Phase>) => api.updateRoadmapPhase(projectId, phase.id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "roadmap"] });
    },
  });

  const deletePhase = useMutation({
    mutationFn: () => api.deleteRoadmapPhase(projectId, phase.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "roadmap"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "roadmap/summary"] });
    },
  });

  const createStep = useMutation({
    mutationFn: () => api.createRoadmapStep(projectId, phase.id, { title: "New step" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "roadmap"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "roadmap/summary"] });
    },
  });

  function commitTitle() {
    setEditingTitle(false);
    if (titleDraft.trim() && titleDraft !== phase.title) {
      updatePhase.mutate({ title: titleDraft.trim() });
    } else {
      setTitleDraft(phase.title);
    }
  }

  const completed = steps.filter(s => s.isChecked).length;
  const total = steps.length;
  const allDone = total > 0 && completed === total;

  return (
    <Card className={"overflow-hidden " + (!collapsed ? "border-l-4 border-l-primary" : "")}>
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}

        {editingTitle ? (
          <Input
            autoFocus
            value={titleDraft}
            onChange={e => setTitleDraft(e.target.value)}
            onClick={e => e.stopPropagation()}
            onBlur={commitTitle}
            onKeyDown={e => {
              if (e.key === "Enter") commitTitle();
              if (e.key === "Escape") { setTitleDraft(phase.title); setEditingTitle(false); }
            }}
            className="h-7 text-base font-medium flex-1"
          />
        ) : (
          <h2
            className="font-medium text-base flex-1"
            onDoubleClick={(e) => { e.stopPropagation(); setEditingTitle(true); }}
          >
            {phase.title}
          </h2>
        )}

        {allDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}

        <Badge variant="outline" className="text-[10px] tabular-nums">
          {completed} / {total}
        </Badge>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete phase "${phase.title}" and all its steps?`)) deletePhase.mutate();
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {!collapsed && (
        <CardContent className="px-4 pb-4 pt-1 space-y-1">
          {steps.map(step => (
            <StepRow key={step.id} step={step} projectId={projectId} phaseId={phase.id} />
          ))}
          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => createStep.mutate()}
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add step
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function ProjectDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const projectId = params.id!;
  const { toast } = useToast();

  const { data: project } = useQuery<ProjectShape>({
    queryKey: ["/api/projects", projectId],
    queryFn: () => api.getProject(projectId),
  });

  const { data: phases = [] } = useQuery<Phase[]>({
    queryKey: ["/api/projects", projectId, "roadmap", "phases"],
    queryFn: () => api.getRoadmapPhases(projectId),
  });

  const { data: summary } = useQuery<{ totalSteps: number; checkedSteps: number }>({
    queryKey: ["/api/projects", projectId, "roadmap/summary"],
    queryFn: () => api.getRoadmapSummary(projectId),
  });

  const createPhase = useMutation({
    mutationFn: () => api.createRoadmapPhase(projectId, { title: "New phase" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "roadmap"] });
    },
    onError: (err: any) => toast({ title: "Couldn't add phase", description: err.message, variant: "destructive" }),
  });

  const totalSteps = summary?.totalSteps ?? 0;
  const checkedSteps = summary?.checkedSteps ?? 0;
  const pct = totalSteps > 0 ? Math.round((checkedSteps / totalSteps) * 100) : 0;

  const companyName = project?.entityName || project?.title || "Project";
  const valuationDate = project?.valuationDate
    ? new Date(project.valuationDate).toLocaleDateString()
    : null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/projects")}
        className="mb-4 -ml-2 text-muted-foreground"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Projects
      </Button>

      <div className="mb-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{companyName}</h1>
            <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1">
              {project?.engagementType && <span>{project.engagementType}</span>}
              {project?.standardOfValue && <span>· {project.standardOfValue}</span>}
              {valuationDate && <span>· Valuation date: {valuationDate}</span>}
              {project?.subjectInterest && <span>· {project.subjectInterest}</span>}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Overall progress</span>
            <span className="tabular-nums">
              {checkedSteps} / {totalSteps} steps · {pct}%
            </span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>
      </div>

      <div className="space-y-3">
        {phases.map(phase => (
          <PhaseCard key={phase.id} phase={phase} projectId={projectId} />
        ))}

        <Button
          variant="outline"
          onClick={() => createPhase.mutate()}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add phase
        </Button>
      </div>
    </div>
  );
}
