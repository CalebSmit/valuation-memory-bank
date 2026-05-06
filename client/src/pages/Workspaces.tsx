import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useWorkspace } from "@/lib/workspace-context";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";
import { Building2, Plus, Check, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function WorkspacesPage() {
  const { workspaceId, setWorkspaceId } = useWorkspace();
  const { toast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const { data: workspaces = [], isLoading } = useQuery({
    queryKey: ["/api/workspaces"],
    queryFn: () => api.getWorkspaces(),
  });

  const createMutation = useMutation({
    mutationFn: () => api.createWorkspace(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces"] });
      setShowCreate(false);
      setForm({ name: "", description: "" });
      toast({ title: "Workspace created" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => api.updateWorkspace(editItem.id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces"] });
      setEditItem(null);
      toast({ title: "Workspace updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces"] });
      toast({ title: "Workspace deleted" });
    },
  });

  function openEdit(ws: any) {
    setEditItem(ws);
    setForm({ name: ws.name, description: ws.description ?? "" });
  }

  function openCreate() {
    setForm({ name: "", description: "" });
    setShowCreate(true);
  }

  return (
    <div className="space-y-6 max-w-3xl" data-testid="page-workspaces">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Workspaces</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage and switch between workspaces</p>
        </div>
        <Button size="sm" onClick={openCreate} data-testid="button-create-workspace">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          New Workspace
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : workspaces.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No workspaces"
          description="Create a workspace to organize your valuation projects."
          action={{ label: "Create Workspace", onClick: openCreate }}
        />
      ) : (
        <div className="space-y-3">
          {workspaces.map((ws: any) => (
            <Card
              key={ws.id}
              className={`cursor-pointer transition-colors ${ws.id === workspaceId ? "border-blue-600" : "hover:border-slate-600"}`}
              data-testid={`workspace-card-${ws.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Building2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-foreground truncate">{ws.name}</p>
                        {ws.id === workspaceId && (
                          <Badge className="text-xs bg-blue-900/50 text-blue-300 border-blue-700">
                            Active
                          </Badge>
                        )}
                      </div>
                      {ws.description && (
                        <p className="text-xs text-muted-foreground truncate">{ws.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {ws.id !== workspaceId && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => setWorkspaceId(ws.id)}
                        data-testid={`button-switch-workspace-${ws.id}`}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Switch
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => openEdit(ws)}
                      data-testid={`button-edit-workspace-${ws.id}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => deleteMutation.mutate(ws.id)}
                      data-testid={`button-delete-workspace-${ws.id}`}
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
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent data-testid="dialog-create-workspace">
          <DialogHeader>
            <DialogTitle>New Workspace</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. My Firm"
                data-testid="input-workspace-name"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description"
                rows={2}
                data-testid="input-workspace-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!form.name.trim() || createMutation.isPending}
              data-testid="button-save-workspace"
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(v) => !v && setEditItem(null)}>
        <DialogContent data-testid="dialog-edit-workspace">
          <DialogHeader>
            <DialogTitle>Edit Workspace</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-testid="input-edit-workspace-name"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                data-testid="input-edit-workspace-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button
              onClick={() => updateMutation.mutate()}
              disabled={!form.name.trim() || updateMutation.isPending}
              data-testid="button-update-workspace"
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
