import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useWorkspace } from "@/lib/workspace-context";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { CloneModal } from "@/components/CloneModal";
import { useToast } from "@/hooks/use-toast";
import { Shield, Plus, Copy, Lock, Pencil, Save, X, Trash2, Star } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

export default function PrinciplesPage() {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const [searchQ, setSearchQ] = useState("");
  const [cloneTarget, setCloneTarget] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [form, setForm] = useState({ title: "", body: "", category: "" });

  const CATEGORIES = [
    "all", "independence", "professional_judgment", "methodology", "documentation",
    "standard_of_value", "level_of_value", "normalization", "report_writing", "ethics", "other",
  ];

  const { data: principles = [], isLoading } = useQuery({
    queryKey: ["/api/principles"],
    queryFn: () => api.getPrinciples(),
  });

  const cloneMutation = useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) =>
      api.clonePrinciple(id, { newTitle, targetWorkspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/principles"] });
      setCloneTarget(null);
      toast({ title: "Principle cloned" });
    },
  });

  const createMutation = useMutation({
    mutationFn: () => api.createPrinciple({ ...form, workspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/principles"] });
      setShowCreate(false);
      setForm({ title: "", body: "", category: "" });
      toast({ title: "Principle created" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deletePrinciple(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/principles"] });
      toast({ title: "Principle deleted" });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: (p: any) => api.createFavorite({ entityType: "principle", entityId: p.id, entityTitle: p.title, workspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/favorites"] }); toast({ title: "Added to favorites" }); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updatePrinciple(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/principles"] });
      setEditItem(null);
      toast({ title: "Principle updated" });
    },
  });

  const filtered = principles.filter((p: any) => {
    const q = searchQ.toLowerCase();
    const matchesQ = !q || p.title?.toLowerCase().includes(q) || p.body?.toLowerCase().includes(q);
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchesQ && matchesCat;
  });

  return (
    <div className="space-y-6" data-testid="page-principles">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Valuation Principles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Core professional standards and reasoning rules</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} data-testid="button-new-principle"><Plus className="h-3.5 w-3.5 mr-1.5" />New</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Input placeholder="Search principles..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="max-w-sm" data-testid="input-search-principles" />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground" data-testid="select-category-principles">
          {CATEGORIES.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Shield} title="No principles" description="No principles match your search." action={{ label: "New Principle", onClick: () => setShowCreate(true) }} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((p: any) => (
            <Card key={p.id} className="hover:border-slate-600 transition-colors" data-testid={`principle-card-${p.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Shield className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    <p className="text-sm font-semibold text-foreground truncate">{p.title}</p>
                    {p.isSeed && <Lock className="h-3 w-3 text-amber-400 flex-shrink-0" />}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-yellow-400" onClick={() => favoriteMutation.mutate(p)} data-testid={`button-fav-principle-${p.id}`}><Star className="h-3 w-3" /></Button>
                    {p.clonable && (
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setCloneTarget(p)} data-testid={`button-clone-principle-${p.id}`}><Copy className="h-3 w-3" /></Button>
                    )}
                    {!p.isSeed && (
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setEditItem(p)} data-testid={`button-edit-principle-${p.id}`}><Pencil className="h-3 w-3" /></Button>
                    )}
                    {!p.isSeed && (
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => deleteMutation.mutate(p.id)} data-testid={`button-delete-principle-${p.id}`}><Trash2 className="h-3 w-3" /></Button>
                    )}
                  </div>
                </div>
                {p.body && <p className="text-xs text-muted-foreground line-clamp-4">{p.body}</p>}
                {p.category && <p className="text-xs text-slate-500 mt-2 capitalize">{p.category.replace(/_/g," ")}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CloneModal open={!!cloneTarget} onClose={() => setCloneTarget(null)} onConfirm={(t) => cloneMutation.mutate({ id: cloneTarget.id, newTitle: t })} entityLabel="Principle" defaultTitle={cloneTarget?.title ?? ""} isLoading={cloneMutation.isPending} />

      {/* Create */}
      <Dialog open={showCreate} onOpenChange={(v) => { if (!v) { setShowCreate(false); setForm({ title: "", body: "", category: "" }); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Principle</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-principle-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. independence, professional_judgment" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Body *</Label><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={5} data-testid="input-principle-body" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!form.title.trim() || createMutation.isPending} data-testid="button-save-principle">{createMutation.isPending ? "Saving..." : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      {editItem && (
        <Dialog open={!!editItem} onOpenChange={(v) => !v && setEditItem(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Principle</DialogTitle></DialogHeader>
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
