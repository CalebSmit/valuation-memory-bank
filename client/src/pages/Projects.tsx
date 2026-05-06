import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { api } from "@/lib/api";
import { useWorkspace } from "@/lib/workspace-context";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { ReviewStatusBadge } from "@/components/ReviewStatusBadge";
import { TagPills } from "@/components/TagPills";
import { useToast } from "@/hooks/use-toast";
import {
  FolderOpen,
  Plus,
  ChevronRight,
  Trash2,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ENGAGEMENT_TYPES = [
  "business_valuation",
  "fairness_opinion",
  "purchase_price_allocation",
  "esop_valuation",
  "gift_estate",
  "litigation_support",
  "other",
];

const INDUSTRIES = [
  "Technology", "Healthcare", "Manufacturing", "Retail",
  "Financial Services", "Real Estate", "Energy", "Media", "Other",
];

export default function ProjectsPage() {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [form, setForm] = useState({
    title: "",
    entityName: "",
    engagementType: "business_valuation",
    industry: "",
    valuationDate: "",
    description: "",
    clientName: "",
  });

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/projects", workspaceId],
    queryFn: () => api.getProjects(workspaceId),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      api.createProject({
        ...form,
        workspaceId: workspaceId ?? "ws_default",
        reviewStatus: "draft",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setShowCreate(false);
      resetForm();
      toast({ title: "Project created" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setDeleteId(null);
      toast({ title: "Project deleted" });
    },
  });

  function resetForm() {
    setForm({
      title: "", entityName: "", engagementType: "business_valuation",
      industry: "", valuationDate: "", description: "", clientName: "",
    });
  }

  const filtered = projects.filter((p: any) => {
    const q = searchQ.toLowerCase();
    return !q || p.title?.toLowerCase().includes(q) || p.entityName?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6" data-testid="page-projects">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Engagement-specific valuation projects (not reference cases)
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} data-testid="button-new-project">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          New Project
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search projects..."
        value={searchQ}
        onChange={(e) => setSearchQ(e.target.value)}
        className="max-w-sm"
        data-testid="input-search-projects"
      />

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={searchQ ? "No matching projects" : "No projects yet"}
          description={
            searchQ
              ? "Try a different search term."
              : "Create a blank project to track a valuation engagement. Reference cases live in the Reference Cases library."
          }
          action={!searchQ ? { label: "New Project", onClick: () => setShowCreate(true) } : undefined}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((p: any) => (
            <Card
              key={p.id}
              className="hover:border-slate-600 transition-colors"
              data-testid={`project-card-${p.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <Link href={`/projects/${p.id}`} className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 cursor-pointer">
                      <FolderOpen className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm text-foreground">{p.title}</p>
                          <ReviewStatusBadge status={p.reviewStatus} />
                        </div>
                        {p.entityName && (
                          <p className="text-xs text-muted-foreground">{p.entityName}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                          {p.engagementType && (
                            <span className="text-xs text-slate-500 capitalize">
                              {p.engagementType.replace(/_/g, " ")}
                            </span>
                          )}
                          {p.valuationDate && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Calendar className="h-2.5 w-2.5" />
                              {p.valuationDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button asChild size="sm" variant="ghost" className="text-xs">
                      <Link href={`/projects/${p.id}`}>
                        Open <ChevronRight className="h-3 w-3 ml-0.5" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(p.id)}
                      data-testid={`button-delete-project-${p.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={(v) => { if (!v) { setShowCreate(false); resetForm(); } }}>
        <DialogContent className="sm:max-w-lg" data-testid="dialog-create-project">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Project Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. ABC Corp Valuation — 12/31/2024"
                data-testid="input-project-title"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Entity / Company Name</Label>
              <Input
                value={form.entityName}
                onChange={(e) => setForm({ ...form, entityName: e.target.value })}
                placeholder="e.g. ABC Corporation"
                data-testid="input-project-entity"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Client Name</Label>
              <Input
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                placeholder="e.g. John Smith"
                data-testid="input-project-client"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Engagement Type</Label>
                <Select
                  value={form.engagementType}
                  onValueChange={(v) => setForm({ ...form, engagementType: v })}
                >
                  <SelectTrigger data-testid="select-engagement-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENGAGEMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Industry</Label>
                <Select
                  value={form.industry || "Other"}
                  onValueChange={(v) => setForm({ ...form, industry: v })}
                >
                  <SelectTrigger data-testid="select-industry">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Valuation Date</Label>
              <Input
                type="date"
                value={form.valuationDate}
                onChange={(e) => setForm({ ...form, valuationDate: e.target.value })}
                data-testid="input-valuation-date"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Description / Scope</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief engagement description..."
                rows={3}
                data-testid="input-project-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancel</Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!form.title.trim() || createMutation.isPending}
              data-testid="button-save-project"
            >
              {createMutation.isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent data-testid="dialog-delete-project">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the project and all associated data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              data-testid="button-confirm-delete-project"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
