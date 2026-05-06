import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useWorkspace } from "@/lib/workspace-context";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { CloneModal } from "@/components/CloneModal";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Pencil, Save, X, Sparkles } from "lucide-react";

export default function TemplateDetail() {
  const [, params] = useRoute("/reasoning-templates/:id");
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const id = params?.id ?? "";
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [showClone, setShowClone] = useState(false);
  const [aiPlaceholder, setAiPlaceholder] = useState<string | null>(null);

  const { data: template, isLoading } = useQuery({
    queryKey: ["/api/reasoning-templates", id],
    queryFn: () => api.getTemplate(id),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reasoning-templates", id] });
      setEditing(false);
      toast({ title: "Template updated" });
    },
  });

  const cloneMutation = useMutation({
    mutationFn: (newTitle: string) =>
      api.cloneTemplate(id, { newTitle, targetWorkspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reasoning-templates"] });
      setShowClone(false);
      toast({ title: "Template cloned" });
    },
  });

  // AI placeholder — no live AI integration in MVP
  function handleAiDraft() {
    setAiPlaceholder(
      "AI-assisted drafting is not yet connected.\n\n" +
      "When integrated, this button will call an LLM to pre-fill the template\n" +
      "with context from your current project. For now, fill in the template manually\n" +
      "by cloning it to your workspace and editing the body."
    );
  }

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-48 w-full" /></div>;
  if (!template) return <div className="text-center py-16"><p className="text-muted-foreground">Template not found.</p><Button asChild variant="outline" size="sm" className="mt-4"><Link href="/reasoning-templates">Back</Link></Button></div>;

  const isReadOnly = !!template.isSeed || !!template.isReadonly;

  return (
    <div className="space-y-6 max-w-3xl" data-testid="page-template-detail">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon"><Link href="/reasoning-templates"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold truncate">{template.title}</h1>
          {template.templateType && <p className="text-sm text-muted-foreground capitalize">{template.templateType.replace(/_/g," ")}</p>}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleAiDraft} data-testid="button-ai-draft-placeholder">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-400" />AI Draft (Placeholder)
          </Button>
          {template.clonable && <Button size="sm" variant="outline" onClick={() => setShowClone(true)} data-testid="button-clone-template">Clone</Button>}
          {!isReadOnly && !editing && (
            <Button size="sm" variant="outline" onClick={() => { setEditForm({ ...template }); setEditing(true); }} data-testid="button-edit-template">
              <Pencil className="h-3.5 w-3.5 mr-1.5" />Edit
            </Button>
          )}
        </div>
      </div>

      {isReadOnly && <ReadOnlyBanner onClone={template.clonable ? () => setShowClone(true) : undefined} entityName="Template" />}

      {/* AI Placeholder Message */}
      {aiPlaceholder && (
        <div className="rounded-lg border border-purple-700/50 bg-purple-950/30 p-4 text-sm text-purple-300">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <pre className="text-xs whitespace-pre-wrap font-sans">{aiPlaceholder}</pre>
          </div>
          <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => setAiPlaceholder(null)}>Dismiss</Button>
        </div>
      )}

      {editing && editForm ? (
        <div className="space-y-4">
          <div><Label className="text-xs text-muted-foreground mb-1 block">Title</Label><Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} /></div>
          <div><Label className="text-xs text-muted-foreground mb-1 block">Body</Label><Textarea value={editForm.body ?? ""} onChange={(e) => setEditForm({ ...editForm, body: e.target.value })} rows={20} className="font-mono text-xs" /></div>
          <div className="flex gap-2">
            <Button onClick={() => updateMutation.mutate(editForm)} disabled={updateMutation.isPending}><Save className="h-3.5 w-3.5 mr-1.5" />{updateMutation.isPending ? "Saving..." : "Save"}</Button>
            <Button variant="outline" onClick={() => setEditing(false)}><X className="h-3.5 w-3.5 mr-1.5" />Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-5">
          <MarkdownViewer content={template.body} />
        </div>
      )}

      <CloneModal open={showClone} onClose={() => setShowClone(false)} onConfirm={(t) => cloneMutation.mutate(t)} entityLabel="Template" defaultTitle={template.title} isLoading={cloneMutation.isPending} />
    </div>
  );
}
