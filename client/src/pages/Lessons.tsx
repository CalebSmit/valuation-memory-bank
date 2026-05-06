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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { CloneModal } from "@/components/CloneModal";
import { useToast } from "@/hooks/use-toast";
import { BookMarked, Plus, Copy, Lock, Pencil, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "methodology","assumptions","normalization","market_approach","income_approach",
  "dlom","level_of_value","client_management","documentation","review_process","other",
];

export default function LessonsPage() {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const [searchQ, setSearchQ] = useState("");
  const [cloneTarget, setCloneTarget] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: "", body: "", category: "methodology" });

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["/api/lessons", workspaceId],
    queryFn: () => api.getLessons(workspaceId),
  });

  const cloneMutation = useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) =>
      api.cloneLesson(id, { newTitle, targetWorkspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      setCloneTarget(null);
      toast({ title: "Lesson cloned" });
    },
  });

  const createMutation = useMutation({
    mutationFn: () => api.createLesson({ ...form, workspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      setShowCreate(false);
      setForm({ title: "", body: "", category: "methodology" });
      toast({ title: "Lesson created" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateLesson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      setEditItem(null);
      toast({ title: "Updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lessons"] });
      toast({ title: "Deleted" });
    },
  });

  const filtered = lessons.filter((l: any) => {
    const q = searchQ.toLowerCase();
    return !q || l.title?.toLowerCase().includes(q) || l.body?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6" data-testid="page-lessons">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Lessons Learned</h1>
          <p className="text-sm text-muted-foreground mt-0.5">What worked, what didn't — captured for future engagements</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} data-testid="button-new-lesson"><Plus className="h-3.5 w-3.5 mr-1.5" />New Lesson</Button>
      </div>

      <Input placeholder="Search lessons..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="max-w-sm" data-testid="input-search-lessons" />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={BookMarked} title="No lessons" description="Record what you learned for future engagements." action={{ label: "New Lesson", onClick: () => setShowCreate(true) }} />
      ) : (
        <div className="space-y-2">
          {filtered.map((l: any) => (
            <Card key={l.id} className="hover:border-slate-600 transition-colors" data-testid={`lesson-card-${l.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <BookMarked className="h-4 w-4 text-rose-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{l.title}</p>
                        {l.isSeed && <Lock className="h-3 w-3 text-amber-400 flex-shrink-0" />}
                        {l.category && <Badge variant="outline" className="text-xs capitalize">{l.category.replace(/_/g," ")}</Badge>}
                      </div>
                      {l.body && <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{l.body}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {l.clonable && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setCloneTarget(l)} data-testid={`button-clone-lesson-${l.id}`}><Copy className="h-3.5 w-3.5" /></Button>}
                    {!l.isSeed && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditItem(l)} data-testid={`button-edit-lesson-${l.id}`}><Pencil className="h-3.5 w-3.5" /></Button>}
                    {!l.isSeed && <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(l.id)} data-testid={`button-delete-lesson-${l.id}`}><Trash2 className="h-3.5 w-3.5" /></Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CloneModal open={!!cloneTarget} onClose={() => setCloneTarget(null)} onConfirm={(t) => cloneMutation.mutate({ id: cloneTarget.id, newTitle: t })} entityLabel="Lesson" defaultTitle={cloneTarget?.title ?? ""} isLoading={cloneMutation.isPending} />

      {/* Create */}
      <Dialog open={showCreate} onOpenChange={(v) => { if (!v) setShowCreate(false); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Lesson Learned</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-lesson-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g," ")}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Body</Label><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={5} data-testid="input-lesson-body" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!form.title.trim() || createMutation.isPending} data-testid="button-save-lesson">{createMutation.isPending ? "Saving..." : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      {editItem && (
        <Dialog open={!!editItem} onOpenChange={(v) => !v && setEditItem(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Lesson</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div><Label className="text-xs text-muted-foreground mb-1 block">Title</Label><Input value={editItem.title} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} /></div>
              <div><Label className="text-xs text-muted-foreground mb-1 block">Body</Label><Textarea value={editItem.body ?? ""} onChange={(e) => setEditItem({ ...editItem, body: e.target.value })} rows={5} /></div>
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
