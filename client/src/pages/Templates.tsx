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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { CloneModal } from "@/components/CloneModal";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Copy, Lock, ChevronRight, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

export default function TemplatesPage() {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const [searchQ, setSearchQ] = useState("");
  const [cloneTarget, setCloneTarget] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", templateType: "", body: "" });

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["/api/reasoning-templates"],
    queryFn: () => api.getTemplates(),
  });

  const cloneMutation = useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) =>
      api.cloneTemplate(id, { newTitle, targetWorkspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reasoning-templates"] });
      setCloneTarget(null);
      toast({ title: "Template cloned" });
    },
  });

  const createMutation = useMutation({
    mutationFn: () => api.createTemplate({ ...form, workspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reasoning-templates"] });
      setShowCreate(false);
      setForm({ title: "", templateType: "", body: "" });
      toast({ title: "Template created" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reasoning-templates"] });
      toast({ title: "Template deleted" });
    },
  });

  const filtered = templates.filter((t: any) => {
    const q = searchQ.toLowerCase();
    return !q || t.title?.toLowerCase().includes(q) || t.templateType?.toLowerCase().includes(q);
  });

  const seedTemplates = filtered.filter((t: any) => t.isSeed);
  const myTemplates = filtered.filter((t: any) => !t.isSeed);

  return (
    <div className="space-y-6" data-testid="page-templates">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Reasoning Templates</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Structured memos and reasoning frameworks to populate for each engagement</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} data-testid="button-new-template"><Plus className="h-3.5 w-3.5 mr-1.5" />New</Button>
      </div>

      <Input placeholder="Search templates..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="max-w-sm" data-testid="input-search-templates" />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No templates" description="No templates match your search." action={{ label: "New Template", onClick: () => setShowCreate(true) }} />
      ) : (
        <>
          {seedTemplates.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Seed Library</p>
              <div className="space-y-2">
                {seedTemplates.map((t: any) => (
                  <TemplateRow key={t.id} template={t} onClone={() => setCloneTarget(t)} />
                ))}
              </div>
            </div>
          )}
          {myTemplates.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">My Templates</p>
              <div className="space-y-2">
                {myTemplates.map((t: any) => (
                  <TemplateRow key={t.id} template={t} onClone={() => setCloneTarget(t)} onDelete={() => deleteMutation.mutate(t.id)} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <CloneModal open={!!cloneTarget} onClose={() => setCloneTarget(null)} onConfirm={(title) => cloneMutation.mutate({ id: cloneTarget.id, newTitle: title })} entityLabel="Template" defaultTitle={cloneTarget?.title ?? ""} isLoading={cloneMutation.isPending} />

      <Dialog open={showCreate} onOpenChange={(v) => { if (!v) { setShowCreate(false); setForm({ title: "", templateType: "", body: "" }); }}}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>New Reasoning Template</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-template-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Template Type</Label><Input value={form.templateType} onChange={(e) => setForm({ ...form, templateType: e.target.value })} placeholder="e.g. wacc_memo, revenue_forecast" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Body</Label><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={8} placeholder="Template content with placeholders..." className="font-mono text-xs" data-testid="input-template-body" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!form.title.trim() || createMutation.isPending} data-testid="button-save-template">{createMutation.isPending ? "Creating..." : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TemplateRow({ template, onClone, onDelete }: { template: any; onClone: () => void; onDelete?: () => void }) {
  return (
    <Card className="hover:border-slate-600 transition-colors" data-testid={`template-card-${template.id}`}>
      <CardContent className="p-3 flex items-center justify-between gap-3">
        <Link href={`/reasoning-templates/${template.id}`} className="flex-1 min-w-0 cursor-pointer">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 text-indigo-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{template.title}</p>
                {template.isSeed && <Lock className="h-3 w-3 text-amber-400 flex-shrink-0" />}
              </div>
              {template.templateType && <p className="text-xs text-muted-foreground capitalize">{template.templateType.replace(/_/g," ")}</p>}
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-1 flex-shrink-0">
          {template.clonable && (
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={onClone} data-testid={`button-clone-template-${template.id}`}><Copy className="h-3 w-3 mr-1" />Clone</Button>
          )}
          <Button asChild size="icon" variant="ghost" className="h-7 w-7">
            <Link href={`/reasoning-templates/${template.id}`}><ChevronRight className="h-3.5 w-3.5" /></Link>
          </Button>
          {onDelete && (
            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={onDelete} data-testid={`button-delete-template-${template.id}`}><Trash2 className="h-3.5 w-3.5" /></Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
