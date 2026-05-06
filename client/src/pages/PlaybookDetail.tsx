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

export default function PlaybookDetail() {
  const [, params] = useRoute("/playbooks/:id");
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const id = params?.id ?? "";
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  const [showClone, setShowClone] = useState(false);

  const { data: playbook, isLoading } = useQuery({
    queryKey: ["/api/playbooks", id],
    queryFn: () => api.getPlaybook(id),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updatePlaybook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playbooks", id] });
      setEditing(false);
      toast({ title: "Playbook updated" });
    },
  });

  const cloneMutation = useMutation({
    mutationFn: (newTitle: string) =>
      api.clonePlaybook(id, { newTitle, targetWorkspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playbooks"] });
      setShowClone(false);
      toast({ title: "Playbook cloned to your workspace" });
    },
  });

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-48 w-full" /></div>;
  }
  if (!playbook) {
    return <div className="text-center py-16"><p className="text-muted-foreground">Playbook not found.</p><Button asChild variant="outline" size="sm" className="mt-4"><Link href="/playbooks">Back</Link></Button></div>;
  }

  const isReadOnly = !!playbook.isSeed || !!playbook.isReadonly;

  function startEdit() {
    setEditForm({ title: playbook.title, engagementType: playbook.engagementType ?? "", body: playbook.body ?? "" });
    setEditing(true);
  }

  return (
    <div className="space-y-6 max-w-3xl" data-testid="page-playbook-detail">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon"><Link href="/playbooks"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-foreground truncate">{playbook.title}</h1>
          {playbook.engagementType && (
            <p className="text-sm text-muted-foreground capitalize">{playbook.engagementType.replace(/_/g, " ")}</p>
          )}
        </div>
        <div className="flex gap-2">
          {playbook.clonable && (
            <Button size="sm" variant="outline" onClick={() => setShowClone(true)} data-testid="button-clone-playbook">
              Clone
            </Button>
          )}
          {!isReadOnly && !editing && (
            <Button size="sm" variant="outline" onClick={startEdit} data-testid="button-edit-playbook">
              <Pencil className="h-3.5 w-3.5 mr-1.5" />Edit
            </Button>
          )}
        </div>
      </div>

      {isReadOnly && <ReadOnlyBanner onClone={playbook.clonable ? () => setShowClone(true) : undefined} entityName="Playbook" />}

      {editing && editForm ? (
        <div className="space-y-4">
          <div><Label className="text-xs text-muted-foreground mb-1 block">Title</Label>
            <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} data-testid="input-edit-playbook-title" /></div>
          <div><Label className="text-xs text-muted-foreground mb-1 block">Engagement Type</Label>
            <Input value={editForm.engagementType} onChange={(e) => setEditForm({ ...editForm, engagementType: e.target.value })} /></div>
          <div><Label className="text-xs text-muted-foreground mb-1 block">Body</Label>
            <Textarea value={editForm.body} onChange={(e) => setEditForm({ ...editForm, body: e.target.value })} rows={16} className="font-mono text-xs" /></div>
          <div className="flex gap-2">
            <Button onClick={() => updateMutation.mutate(editForm)} disabled={updateMutation.isPending} data-testid="button-save-edit-playbook">
              <Save className="h-3.5 w-3.5 mr-1.5" />{updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)} data-testid="button-cancel-edit-playbook">
              <X className="h-3.5 w-3.5 mr-1.5" />Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card p-5">
          <MarkdownViewer content={playbook.body} />
        </div>
      )}

      <CloneModal
        open={showClone}
        onClose={() => setShowClone(false)}
        onConfirm={(newTitle) => cloneMutation.mutate(newTitle)}
        entityLabel="Playbook"
        defaultTitle={playbook.title}
        isLoading={cloneMutation.isPending}
      />
    </div>
  );
}
