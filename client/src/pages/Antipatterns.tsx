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
import { AlertTriangle, Plus, Copy, Lock, Pencil, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-900/50 text-red-300 border-red-700",
  high: "bg-orange-900/50 text-orange-300 border-orange-700",
  medium: "bg-amber-900/50 text-amber-300 border-amber-700",
  low: "bg-slate-800 text-slate-400 border-slate-700",
};

export default function AntipatternsPage() {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const [searchQ, setSearchQ] = useState("");
  const [cloneTarget, setCloneTarget] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", severity: "medium", consequence: "", remediation: "", category: "" });

  const { data: antipatterns = [], isLoading } = useQuery({
    queryKey: ["/api/anti-patterns"],
    queryFn: () => api.getAntipatterns(),
  });

  const cloneMutation = useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) =>
      api.cloneAntipattern(id, { newTitle, targetWorkspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/anti-patterns"] });
      setCloneTarget(null);
      toast({ title: "Anti-pattern cloned" });
    },
  });

  const createMutation = useMutation({
    mutationFn: () => api.createAntipattern({ ...form, workspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/anti-patterns"] });
      setShowCreate(false);
      setForm({ title: "", description: "", severity: "medium", consequence: "", remediation: "", category: "" });
      toast({ title: "Anti-pattern created" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateAntipattern(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/anti-patterns"] });
      setEditItem(null);
      toast({ title: "Updated" });
    },
  });

  const filtered = antipatterns.filter((a: any) => {
    const q = searchQ.toLowerCase();
    return !q || a.title?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6" data-testid="page-antipatterns">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Anti-Patterns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Common valuation mistakes and how to avoid them</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} data-testid="button-new-antipattern"><Plus className="h-3.5 w-3.5 mr-1.5" />New</Button>
      </div>

      <Input placeholder="Search anti-patterns..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="max-w-sm" data-testid="input-search-antipatterns" />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No anti-patterns" description="No anti-patterns match your search." action={{ label: "New Anti-Pattern", onClick: () => setShowCreate(true) }} />
      ) : (
        <div className="space-y-2">
          {filtered.map((a: any) => (
            <Card key={a.id} className="hover:border-slate-600 transition-colors" data-testid={`antipattern-card-${a.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{a.title}</p>
                        {a.isSeed && <Lock className="h-3 w-3 text-amber-400 flex-shrink-0" />}
                        {a.severity && (
                          <Badge variant="outline" className={`text-xs ${SEVERITY_COLORS[a.severity] ?? ""}`}>{a.severity}</Badge>
                        )}
                      </div>
                      {a.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>}
                      {(a.whyItMatters || a.consequence) && <p className="text-xs text-red-400/80 mt-1">⚠ {a.whyItMatters ?? a.consequence}</p>}
                      {(a.howToFix || a.remediation) && <p className="text-xs text-emerald-400/80 mt-0.5">✓ {a.howToFix ?? a.remediation}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {a.clonable && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setCloneTarget(a)} data-testid={`button-clone-antipattern-${a.id}`}><Copy className="h-3.5 w-3.5" /></Button>}
                    {!a.isSeed && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditItem(a)} data-testid={`button-edit-antipattern-${a.id}`}><Pencil className="h-3.5 w-3.5" /></Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CloneModal open={!!cloneTarget} onClose={() => setCloneTarget(null)} onConfirm={(t) => cloneMutation.mutate({ id: cloneTarget.id, newTitle: t })} entityLabel="Anti-Pattern" defaultTitle={cloneTarget?.title ?? ""} isLoading={cloneMutation.isPending} />

      {/* Create */}
      <Dialog open={showCreate} onOpenChange={(v) => { if (!v) setShowCreate(false); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>New Anti-Pattern</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-antipattern-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Severity</Label>
              <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["critical","high","medium","low"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} data-testid="input-antipattern-description" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Consequence</Label><Input value={form.consequence} onChange={(e) => setForm({ ...form, consequence: e.target.value })} /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Remediation</Label><Input value={form.remediation} onChange={(e) => setForm({ ...form, remediation: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!form.title.trim() || createMutation.isPending} data-testid="button-save-antipattern">{createMutation.isPending ? "Saving..." : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      {editItem && (
        <Dialog open={!!editItem} onOpenChange={(v) => !v && setEditItem(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Edit Anti-Pattern</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div><Label className="text-xs text-muted-foreground mb-1 block">Title</Label><Input value={editItem.title} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} /></div>
              <div><Label className="text-xs text-muted-foreground mb-1 block">Description</Label><Textarea value={editItem.description ?? ""} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} rows={3} /></div>
              <div><Label className="text-xs text-muted-foreground mb-1 block">Consequence</Label><Input value={editItem.whyItMatters ?? editItem.consequence ?? ""} onChange={(e) => setEditItem({ ...editItem, whyItMatters: e.target.value })} /></div>
              <div><Label className="text-xs text-muted-foreground mb-1 block">Remediation</Label><Input value={editItem.howToFix ?? editItem.remediation ?? ""} onChange={(e) => setEditItem({ ...editItem, howToFix: e.target.value })} /></div>
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
