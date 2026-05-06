import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { StickyNote, Plus, Pencil, Trash2, Save, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

export default function NotesPage() {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const [searchQ, setSearchQ] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: "", body: "" });

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["/api/notes", workspaceId],
    queryFn: () => api.getNotes(workspaceId),
  });

  const createMutation = useMutation({
    mutationFn: () => api.createNote({ ...form, workspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setShowCreate(false);
      setForm({ title: "", body: "" });
      toast({ title: "Note created" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setEditItem(null);
      toast({ title: "Note updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({ title: "Note deleted" });
    },
  });

  const filtered = notes.filter((n: any) => {
    const q = searchQ.toLowerCase();
    return !q || n.title?.toLowerCase().includes(q) || n.body?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6" data-testid="page-notes">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Notes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Analyst notes across projects and engagements</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} data-testid="button-new-note">
          <Plus className="h-3.5 w-3.5 mr-1.5" />New Note
        </Button>
      </div>

      <Input placeholder="Search notes..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="max-w-sm" data-testid="input-search-notes" />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={StickyNote} title="No notes" description="Capture analyst notes for your engagements." action={{ label: "New Note", onClick: () => setShowCreate(true) }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((n: any) => (
            <Card key={n.id} className="hover:border-slate-600 transition-colors" data-testid={`note-card-${n.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-foreground flex-1 min-w-0 truncate">{n.title}</p>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setEditItem(n)} data-testid={`button-edit-note-${n.id}`}><Pencil className="h-3 w-3" /></Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => deleteMutation.mutate(n.id)} data-testid={`button-delete-note-${n.id}`}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
                {n.body && <p className="text-xs text-muted-foreground line-clamp-5">{n.body}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create */}
      <Dialog open={showCreate} onOpenChange={(v) => { if (!v) { setShowCreate(false); setForm({ title: "", body: "" }); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>New Note</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-note-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Body</Label><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={8} data-testid="input-note-body" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!form.title.trim() || createMutation.isPending} data-testid="button-save-note">{createMutation.isPending ? "Saving..." : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      {editItem && (
        <Dialog open={!!editItem} onOpenChange={(v) => !v && setEditItem(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Edit Note</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div><Label className="text-xs text-muted-foreground mb-1 block">Title</Label><Input value={editItem.title} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} /></div>
              <div><Label className="text-xs text-muted-foreground mb-1 block">Body</Label><Textarea value={editItem.body ?? ""} onChange={(e) => setEditItem({ ...editItem, body: e.target.value })} rows={8} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
              <Button onClick={() => updateMutation.mutate({ id: editItem.id, data: editItem })} disabled={updateMutation.isPending}>{updateMutation.isPending ? "Saving..." : "Save"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
