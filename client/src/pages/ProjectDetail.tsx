import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useWorkspace } from "@/lib/workspace-context";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ReviewStatusBadge } from "@/components/ReviewStatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Plus, Pencil, Trash2, ExternalLink, FileText,
  MessageSquare, StickyNote, BookMarked, Settings, Link2, Database, ListTree
} from "lucide-react";
import { ReportOutline } from "@/components/ReportOutline/ReportOutline";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const projectId = params?.id ?? "";

  const { data: project, isLoading } = useQuery({
    queryKey: ["/api/projects", projectId],
    queryFn: () => api.getProject(projectId),
    enabled: !!projectId,
  });

  const { data: assumptions = [] } = useQuery({
    queryKey: ["/api/assumptions", workspaceId, projectId],
    queryFn: () => api.getAssumptions(workspaceId, projectId),
    enabled: !!projectId,
  });

  const { data: sources = [] } = useQuery({
    queryKey: ["/api/sources", workspaceId, projectId],
    queryFn: () => api.getSources(workspaceId, projectId),
    enabled: !!projectId,
  });

  const { data: externalRefs = [] } = useQuery({
    queryKey: ["/api/external-model-references", workspaceId, projectId],
    queryFn: () => api.getExternalModelRefs(workspaceId, projectId),
    enabled: !!projectId,
  });

  const { data: memos = [] } = useQuery({
    queryKey: ["/api/support-memos", workspaceId, projectId],
    queryFn: () => api.getSupportMemos(workspaceId, projectId),
    enabled: !!projectId,
  });

  const { data: qaItems = [] } = useQuery({
    queryKey: ["/api/qa", workspaceId, projectId],
    queryFn: () => api.getQaItems(workspaceId, projectId),
    enabled: !!projectId,
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["/api/notes", workspaceId, projectId],
    queryFn: () => api.getNotes(workspaceId, projectId),
    enabled: !!projectId,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["/api/lessons", workspaceId, projectId],
    queryFn: () => api.getLessons(workspaceId, projectId),
    enabled: !!projectId,
  });

  // Edit project state
  const [editForm, setEditForm] = useState<any>(null);
  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      setEditForm(null);
      toast({ title: "Project updated" });
    },
  });

  // ---- Assumption modal ----
  const [showAssumption, setShowAssumption] = useState(false);
  const [aForm, setAForm] = useState({ title: "", body: "", assumptionType: "methodology", reviewStatus: "draft" });
  const createAssumption = useMutation({
    mutationFn: () => api.createAssumption({ ...aForm, workspaceId: workspaceId ?? "ws_default", projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assumptions"] });
      setShowAssumption(false);
      setAForm({ title: "", body: "", assumptionType: "methodology", reviewStatus: "draft" });
      toast({ title: "Assumption added" });
    },
  });
  const deleteAssumption = useMutation({
    mutationFn: (id: string) => api.deleteAssumption(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/assumptions"] }),
  });

  // ---- Source modal ----
  const [showSource, setShowSource] = useState(false);
  const [sForm, setSForm] = useState({ title: "", sourceType: "management_report", url: "", description: "", reliabilityScore: "3" });
  const createSource = useMutation({
    mutationFn: () => api.createSource({ ...sForm, workspaceId: workspaceId ?? "ws_default", projectId, reliabilityScore: Number(sForm.reliabilityScore) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sources"] });
      setShowSource(false);
      setSForm({ title: "", sourceType: "management_report", url: "", description: "", reliabilityScore: "3" });
      toast({ title: "Source added" });
    },
  });
  const deleteSource = useMutation({
    mutationFn: (id: string) => api.deleteSource(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/sources"] }),
  });

  // ---- External model modal ----
  const [showExtRef, setShowExtRef] = useState(false);
  const [eForm, setEForm] = useState({ title: "", modelType: "dcf", storageLocation: "", notes: "" });
  const createExtRef = useMutation({
    mutationFn: () => api.createExternalModelRef({ ...eForm, workspaceId: workspaceId ?? "ws_default", projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/external-model-references"] });
      setShowExtRef(false);
      setEForm({ title: "", modelType: "dcf", storageLocation: "", notes: "" });
      toast({ title: "Model reference added" });
    },
  });
  const deleteExtRef = useMutation({
    mutationFn: (id: string) => api.deleteExternalModelRef(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/external-model-references"] }),
  });

  // ---- Support Memo modal ----
  const [showMemo, setShowMemo] = useState(false);
  const [mForm, setMForm] = useState({ title: "", memoType: "methodology_support", body: "", reviewStatus: "draft" });
  const createMemo = useMutation({
    mutationFn: () => api.createSupportMemo({ ...mForm, workspaceId: workspaceId ?? "ws_default", projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support-memos"] });
      setShowMemo(false);
      setMForm({ title: "", memoType: "methodology_support", body: "", reviewStatus: "draft" });
      toast({ title: "Support memo created" });
    },
  });
  const deleteMemo = useMutation({
    mutationFn: (id: string) => api.deleteSupportMemo(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/support-memos"] }),
  });

  // ---- Q&A modal ----
  const [showQA, setShowQA] = useState(false);
  const [qForm, setQForm] = useState({ question: "", answer: "", category: "methodology" });
  const createQA = useMutation({
    mutationFn: () => api.createQaItem({ ...qForm, workspaceId: workspaceId ?? "ws_default", projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/qa"] });
      setShowQA(false);
      setQForm({ question: "", answer: "", category: "methodology" });
      toast({ title: "Q&A item added" });
    },
  });
  const deleteQA = useMutation({
    mutationFn: (id: string) => api.deleteQaItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/qa"] }),
  });

  // ---- Note modal ----
  const [showNote, setShowNote] = useState(false);
  const [nForm, setNForm] = useState({ title: "", body: "" });
  const createNote = useMutation({
    mutationFn: () => api.createNote({ ...nForm, workspaceId: workspaceId ?? "ws_default", projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setShowNote(false);
      setNForm({ title: "", body: "" });
      toast({ title: "Note added" });
    },
  });
  const deleteNote = useMutation({
    mutationFn: (id: string) => api.deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/notes"] }),
  });

  // ---- Lesson modal ----
  const [showLesson, setShowLesson] = useState(false);
  const [lForm, setLForm] = useState({ title: "", body: "", category: "methodology" });
  const createLesson = useMutation({
    mutationFn: () => api.createLesson({ ...lForm, workspaceId: workspaceId ?? "ws_default", projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      setShowLesson(false);
      setLForm({ title: "", body: "", category: "methodology" });
      toast({ title: "Lesson added" });
    },
  });
  const deleteLesson = useMutation({
    mutationFn: (id: string) => api.deleteLesson(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/lessons"] }),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Project not found.</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="page-project-detail">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button asChild variant="ghost" size="icon" className="mt-0.5">
            <Link href="/projects"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold text-foreground">{project.title}</h1>
              <ReviewStatusBadge status={project.reviewStatus} />
            </div>
            {project.entityName && (
              <p className="text-sm text-muted-foreground">{project.entityName}</p>
            )}
            <div className="flex gap-3 mt-1">
              {project.engagementType && (
                <span className="text-xs text-slate-500 capitalize">
                  {project.engagementType.replace(/_/g, " ")}
                </span>
              )}
              {project.valuationDate && (
                <span className="text-xs text-slate-500">
                  Valuation Date: {project.valuationDate}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditForm({ ...project })}
          data-testid="button-edit-project"
        >
          <Pencil className="h-3.5 w-3.5 mr-1.5" />
          Edit
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="outline" data-testid="tabs-project-detail">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="outline" className="text-xs"><ListTree className="h-3 w-3 mr-1" />Report Outline</TabsTrigger>
          <TabsTrigger value="assumptions" className="text-xs">Assumptions</TabsTrigger>
          <TabsTrigger value="sources" className="text-xs">Sources</TabsTrigger>
          <TabsTrigger value="models" className="text-xs">External Models</TabsTrigger>
          <TabsTrigger value="memos" className="text-xs">Support Memos</TabsTrigger>
          <TabsTrigger value="qa" className="text-xs">Q&A</TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
          <TabsTrigger value="lessons" className="text-xs">Lessons</TabsTrigger>
        </TabsList>

        {/* REPORT OUTLINE */}
        <TabsContent value="outline" className="mt-4">
          <ReportOutline
            projectId={projectId}
            workspaceId={workspaceId ?? "ws_default"}
            sources={sources}
            assumptions={assumptions}
            externalModels={externalRefs}
            supportMemos={memos}
            onCreateSource={() => setShowSource(true)}
            onCreateAssumption={() => setShowAssumption(true)}
            onCreateExternalModel={() => setShowExtRef(true)}
            onCreateSupportMemo={() => setShowMemo(true)}
          />
        </TabsContent>

        {/* ASSUMPTIONS */}
        <TabsContent value="assumptions" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Assumptions ({assumptions.length})</h2>
            <Button size="sm" onClick={() => setShowAssumption(true)} data-testid="button-add-assumption">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add
            </Button>
          </div>
          {assumptions.length === 0 ? (
            <EmptyState icon={Database} title="No assumptions" description="Track key valuation assumptions for this engagement." action={{ label: "Add Assumption", onClick: () => setShowAssumption(true) }} />
          ) : (
            <div className="space-y-2">
              {assumptions.map((a: any) => (
                <Card key={a.id} data-testid={`assumption-card-${a.id}`}>
                  <CardContent className="p-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{a.title}</p>
                        <ReviewStatusBadge status={a.reviewStatus} />
                      </div>
                      {a.body && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>}
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteAssumption.mutate(a.id)} data-testid={`button-delete-assumption-${a.id}`}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* SOURCES */}
        <TabsContent value="sources" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Sources ({sources.length})</h2>
            <Button size="sm" onClick={() => setShowSource(true)} data-testid="button-add-source"><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
          </div>
          {sources.length === 0 ? (
            <EmptyState icon={Link2} title="No sources" description="Document data sources used in this engagement." action={{ label: "Add Source", onClick: () => setShowSource(true) }} />
          ) : (
            <div className="space-y-2">
              {sources.map((s: any) => (
                <Card key={s.id} data-testid={`source-card-${s.id}`}>
                  <CardContent className="p-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{s.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs">{s.sourceType?.replace(/_/g, " ")}</Badge>
                        {s.reliabilityScore && <span className="text-xs text-muted-foreground">Reliability: {s.reliabilityScore}/5</span>}
                      </div>
                      {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1"><ExternalLink className="h-2.5 w-2.5" />{s.url}</a>}
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteSource.mutate(s.id)} data-testid={`button-delete-source-${s.id}`}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* EXTERNAL MODELS */}
        <TabsContent value="models" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">External Model References ({externalRefs.length})</h2>
            <Button size="sm" onClick={() => setShowExtRef(true)} data-testid="button-add-ext-ref"><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
          </div>
          {externalRefs.length === 0 ? (
            <EmptyState icon={ExternalLink} title="No external models" description="Link to Excel, Google Sheets, or firm models used in this engagement." action={{ label: "Add Reference", onClick: () => setShowExtRef(true) }} />
          ) : (
            <div className="space-y-2">
              {externalRefs.map((r: any) => (
                <Card key={r.id} data-testid={`ext-ref-card-${r.id}`}>
                  <CardContent className="p-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{r.title}</p>
                      <Badge variant="outline" className="text-xs mt-0.5">{r.modelType?.toUpperCase()}</Badge>
                      {r.storageLocation && <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.storageLocation}</p>}
                      {r.notes && <p className="text-xs text-slate-500 mt-0.5">{r.notes}</p>}
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteExtRef.mutate(r.id)} data-testid={`button-delete-ext-ref-${r.id}`}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* SUPPORT MEMOS */}
        <TabsContent value="memos" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Support Memos ({memos.length})</h2>
            <Button size="sm" onClick={() => setShowMemo(true)} data-testid="button-add-memo"><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
          </div>
          {memos.length === 0 ? (
            <EmptyState icon={FileText} title="No support memos" description="Create methodology memos, revenue analyses, or other supporting documents." action={{ label: "Add Memo", onClick: () => setShowMemo(true) }} />
          ) : (
            <div className="space-y-2">
              {memos.map((m: any) => (
                <Card key={m.id} data-testid={`memo-card-${m.id}`}>
                  <CardContent className="p-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{m.title}</p>
                        <ReviewStatusBadge status={m.reviewStatus} />
                      </div>
                      <Badge variant="outline" className="text-xs mt-0.5">{m.memoType?.replace(/_/g, " ")}</Badge>
                      {m.body && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.body}</p>}
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteMemo.mutate(m.id)} data-testid={`button-delete-memo-${m.id}`}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Q&A */}
        <TabsContent value="qa" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Q&A ({qaItems.length})</h2>
            <Button size="sm" onClick={() => setShowQA(true)} data-testid="button-add-qa"><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
          </div>
          {qaItems.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No Q&A items" description="Track reviewer questions, client questions, and your answers." action={{ label: "Add Q&A", onClick: () => setShowQA(true) }} />
          ) : (
            <div className="space-y-2">
              {qaItems.map((q: any) => (
                <Card key={q.id} data-testid={`qa-card-${q.id}`}>
                  <CardContent className="p-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Q: {q.question}</p>
                      {q.answer && <p className="text-xs text-muted-foreground mt-1">A: {q.answer}</p>}
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteQA.mutate(q.id)} data-testid={`button-delete-qa-${q.id}`}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* NOTES */}
        <TabsContent value="notes" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Notes ({notes.length})</h2>
            <Button size="sm" onClick={() => setShowNote(true)} data-testid="button-add-note"><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
          </div>
          {notes.length === 0 ? (
            <EmptyState icon={StickyNote} title="No notes" description="Capture analyst notes tied to this project." action={{ label: "Add Note", onClick: () => setShowNote(true) }} />
          ) : (
            <div className="space-y-2">
              {notes.map((n: any) => (
                <Card key={n.id} data-testid={`note-card-${n.id}`}>
                  <CardContent className="p-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{n.title}</p>
                      {n.body && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.body}</p>}
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteNote.mutate(n.id)} data-testid={`button-delete-note-${n.id}`}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* LESSONS */}
        <TabsContent value="lessons" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Lessons Learned ({lessons.length})</h2>
            <Button size="sm" onClick={() => setShowLesson(true)} data-testid="button-add-lesson"><Plus className="h-3.5 w-3.5 mr-1" /> Add</Button>
          </div>
          {lessons.length === 0 ? (
            <EmptyState icon={BookMarked} title="No lessons" description="Record what you learned for future engagements." action={{ label: "Add Lesson", onClick: () => setShowLesson(true) }} />
          ) : (
            <div className="space-y-2">
              {lessons.map((l: any) => (
                <Card key={l.id} data-testid={`lesson-card-${l.id}`}>
                  <CardContent className="p-3 flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{l.title}</p>
                      {l.body && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{l.body}</p>}
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteLesson.mutate(l.id)} data-testid={`button-delete-lesson-${l.id}`}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ---- Dialogs ---- */}

      {/* Edit Project */}
      {editForm && (
        <Dialog open={!!editForm} onOpenChange={(v) => !v && setEditForm(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div><Label className="text-xs text-muted-foreground mb-1 block">Title</Label>
                <Input value={editForm.title ?? ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} data-testid="input-edit-project-title" /></div>
              <div><Label className="text-xs text-muted-foreground mb-1 block">Entity Name</Label>
                <Input value={editForm.entityName ?? ""} onChange={(e) => setEditForm({ ...editForm, entityName: e.target.value })} data-testid="input-edit-project-entity" /></div>
              <div><Label className="text-xs text-muted-foreground mb-1 block">Review Status</Label>
                <Select value={editForm.reviewStatus ?? "draft"} onValueChange={(v) => setEditForm({ ...editForm, reviewStatus: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["draft","in_review","reviewed","approved","archived"].map(s => <SelectItem key={s} value={s}>{s.replace(/_/g," ")}</SelectItem>)}
                  </SelectContent>
                </Select></div>
              <div><Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
                <Textarea value={editForm.description ?? ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditForm(null)}>Cancel</Button>
              <Button onClick={() => updateMutation.mutate(editForm)} disabled={updateMutation.isPending} data-testid="button-save-project-edit">
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Assumption */}
      <Dialog open={showAssumption} onOpenChange={(v) => !v && setShowAssumption(false)}>
        <DialogContent><DialogHeader><DialogTitle>Add Assumption</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label>
              <Input value={aForm.title} onChange={(e) => setAForm({ ...aForm, title: e.target.value })} data-testid="input-assumption-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Body / Detail</Label>
              <Textarea value={aForm.body} onChange={(e) => setAForm({ ...aForm, body: e.target.value })} rows={3} data-testid="input-assumption-body" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssumption(false)}>Cancel</Button>
            <Button onClick={() => createAssumption.mutate()} disabled={!aForm.title.trim() || createAssumption.isPending} data-testid="button-save-assumption">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Source */}
      <Dialog open={showSource} onOpenChange={(v) => !v && setShowSource(false)}>
        <DialogContent><DialogHeader><DialogTitle>Add Source</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label>
              <Input value={sForm.title} onChange={(e) => setSForm({ ...sForm, title: e.target.value })} data-testid="input-source-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">URL / Path</Label>
              <Input value={sForm.url} onChange={(e) => setSForm({ ...sForm, url: e.target.value })} placeholder="https://..." data-testid="input-source-url" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
              <Textarea value={sForm.description} onChange={(e) => setSForm({ ...sForm, description: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSource(false)}>Cancel</Button>
            <Button onClick={() => createSource.mutate()} disabled={!sForm.title.trim() || createSource.isPending} data-testid="button-save-source">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* External Model Ref */}
      <Dialog open={showExtRef} onOpenChange={(v) => !v && setShowExtRef(false)}>
        <DialogContent><DialogHeader><DialogTitle>Add External Model Reference</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label>
              <Input value={eForm.title} onChange={(e) => setEForm({ ...eForm, title: e.target.value })} placeholder="e.g. DCF Model v3.xlsx" data-testid="input-ext-ref-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Storage Location / Path</Label>
              <Input value={eForm.storageLocation} onChange={(e) => setEForm({ ...eForm, storageLocation: e.target.value })} placeholder="e.g. SharePoint link or file path" data-testid="input-ext-ref-location" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Notes</Label>
              <Textarea value={eForm.notes} onChange={(e) => setEForm({ ...eForm, notes: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExtRef(false)}>Cancel</Button>
            <Button onClick={() => createExtRef.mutate()} disabled={!eForm.title.trim() || createExtRef.isPending} data-testid="button-save-ext-ref">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Support Memo */}
      <Dialog open={showMemo} onOpenChange={(v) => !v && setShowMemo(false)}>
        <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>New Support Memo</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label>
              <Input value={mForm.title} onChange={(e) => setMForm({ ...mForm, title: e.target.value })} data-testid="input-memo-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Memo Type</Label>
              <Select value={mForm.memoType} onValueChange={(v) => setMForm({ ...mForm, memoType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["methodology_support","revenue_analysis","normalization","management_projections","market_approach","guideline_screening","asset_approach","dlom","level_of_value","method_weighting","final_conclusion","other"].map(t => <SelectItem key={t} value={t}>{t.replace(/_/g," ")}</SelectItem>)}
                </SelectContent>
              </Select></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Body</Label>
              <Textarea value={mForm.body} onChange={(e) => setMForm({ ...mForm, body: e.target.value })} rows={5} placeholder="Write memo content..." data-testid="input-memo-body" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMemo(false)}>Cancel</Button>
            <Button onClick={() => createMemo.mutate()} disabled={!mForm.title.trim() || createMemo.isPending} data-testid="button-save-memo">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Q&A */}
      <Dialog open={showQA} onOpenChange={(v) => !v && setShowQA(false)}>
        <DialogContent><DialogHeader><DialogTitle>Add Q&A Item</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Question *</Label>
              <Input value={qForm.question} onChange={(e) => setQForm({ ...qForm, question: e.target.value })} data-testid="input-qa-question" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Answer</Label>
              <Textarea value={qForm.answer} onChange={(e) => setQForm({ ...qForm, answer: e.target.value })} rows={3} data-testid="input-qa-answer" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQA(false)}>Cancel</Button>
            <Button onClick={() => createQA.mutate()} disabled={!qForm.question.trim() || createQA.isPending} data-testid="button-save-qa">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Note */}
      <Dialog open={showNote} onOpenChange={(v) => !v && setShowNote(false)}>
        <DialogContent><DialogHeader><DialogTitle>Add Note</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label>
              <Input value={nForm.title} onChange={(e) => setNForm({ ...nForm, title: e.target.value })} data-testid="input-note-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Body</Label>
              <Textarea value={nForm.body} onChange={(e) => setNForm({ ...nForm, body: e.target.value })} rows={4} data-testid="input-note-body" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNote(false)}>Cancel</Button>
            <Button onClick={() => createNote.mutate()} disabled={!nForm.title.trim() || createNote.isPending} data-testid="button-save-note">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson */}
      <Dialog open={showLesson} onOpenChange={(v) => !v && setShowLesson(false)}>
        <DialogContent><DialogHeader><DialogTitle>Add Lesson Learned</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label>
              <Input value={lForm.title} onChange={(e) => setLForm({ ...lForm, title: e.target.value })} data-testid="input-lesson-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Body</Label>
              <Textarea value={lForm.body} onChange={(e) => setLForm({ ...lForm, body: e.target.value })} rows={3} data-testid="input-lesson-body" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLesson(false)}>Cancel</Button>
            <Button onClick={() => createLesson.mutate()} disabled={!lForm.title.trim() || createLesson.isPending} data-testid="button-save-lesson">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
