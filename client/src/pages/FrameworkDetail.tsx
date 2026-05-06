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
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { CloneModal } from "@/components/CloneModal";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Pencil, Save, X } from "lucide-react";

export default function FrameworkDetail() {
  const [, params] = useRoute("/frameworks/:id");
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const id = params?.id ?? "";
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [showClone, setShowClone] = useState(false);

  const { data: framework, isLoading } = useQuery({
    queryKey: ["/api/frameworks", id],
    queryFn: () => api.getFramework(id),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateFramework(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/frameworks", id] });
      setEditing(false);
      toast({ title: "Framework updated" });
    },
  });

  const cloneMutation = useMutation({
    mutationFn: (newTitle: string) =>
      api.cloneFramework(id, { newTitle, targetWorkspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/frameworks"] });
      setShowClone(false);
      toast({ title: "Framework cloned" });
    },
  });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-48 w-full" /></div>;
  if (!framework) return <div className="text-center py-16"><p className="text-muted-foreground">Framework not found.</p><Button asChild variant="outline" size="sm" className="mt-4"><Link href="/frameworks">Back</Link></Button></div>;

  const isReadOnly = !!framework.isSeed || !!framework.isReadonly;

  return (
    <div className="space-y-6 max-w-3xl" data-testid="page-framework-detail">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon"><Link href="/frameworks"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold truncate">{framework.title}</h1>
          {framework.frameworkType && <p className="text-sm text-muted-foreground capitalize">{framework.frameworkType.replace(/_/g," ")}</p>}
        </div>
        <div className="flex gap-2">
          {framework.clonable && <Button size="sm" variant="outline" onClick={() => setShowClone(true)} data-testid="button-clone-framework">Clone</Button>}
          {!isReadOnly && !editing && <Button size="sm" variant="outline" onClick={() => { setEditForm({ ...framework }); setEditing(true); }} data-testid="button-edit-framework"><Pencil className="h-3.5 w-3.5 mr-1.5" />Edit</Button>}
        </div>
      </div>

      {isReadOnly && <ReadOnlyBanner onClone={framework.clonable ? () => setShowClone(true) : undefined} entityName="Framework" />}

      {editing && editForm ? (
        <div className="space-y-4">
          <div><Label className="text-xs text-muted-foreground mb-1 block">Title</Label><Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} /></div>
          <div><Label className="text-xs text-muted-foreground mb-1 block">Body</Label><Textarea value={editForm.body ?? ""} onChange={(e) => setEditForm({ ...editForm, body: e.target.value })} rows={16} className="font-mono text-xs" /></div>
          <div className="flex gap-2">
            <Button onClick={() => updateMutation.mutate(editForm)} disabled={updateMutation.isPending}><Save className="h-3.5 w-3.5 mr-1.5" />{updateMutation.isPending ? "Saving..." : "Save"}</Button>
            <Button variant="outline" onClick={() => setEditing(false)}><X className="h-3.5 w-3.5 mr-1.5" />Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-5"><MarkdownViewer content={framework.body} /></div>
      )}

      <CloneModal open={showClone} onClose={() => setShowClone(false)} onConfirm={(t) => cloneMutation.mutate(t)} entityLabel="Framework" defaultTitle={framework.title} isLoading={cloneMutation.isPending} />
    </div>
  );
}
