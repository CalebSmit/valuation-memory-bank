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
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { CloneModal } from "@/components/CloneModal";
import { useToast } from "@/hooks/use-toast";
import { GitBranch, Plus, Copy, Lock, ChevronRight, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

export default function FrameworksPage() {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const [searchQ, setSearchQ] = useState("");
  const [cloneTarget, setCloneTarget] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", frameworkType: "", body: "" });

  const { data: frameworks = [], isLoading } = useQuery({
    queryKey: ["/api/frameworks"],
    queryFn: () => api.getFrameworks(),
  });

  const cloneMutation = useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) =>
      api.cloneFramework(id, { newTitle, targetWorkspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/frameworks"] });
      setCloneTarget(null);
      toast({ title: "Framework cloned" });
    },
  });

  const createMutation = useMutation({
    mutationFn: () => api.createFramework({ ...form, workspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/frameworks"] });
      setShowCreate(false);
      setForm({ title: "", frameworkType: "", body: "" });
      toast({ title: "Framework created" });
    },
  });

  const filtered = frameworks.filter((f: any) => {
    const q = searchQ.toLowerCase();
    return !q || f.title?.toLowerCase().includes(q) || f.frameworkType?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6" data-testid="page-frameworks">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Decision Frameworks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Structured decision trees for valuation judgments</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} data-testid="button-new-framework">
          <Plus className="h-3.5 w-3.5 mr-1.5" />New
        </Button>
      </div>

      <Input placeholder="Search frameworks..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="max-w-sm" data-testid="input-search-frameworks" />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={GitBranch} title="No frameworks" description="No frameworks match your search." action={{ label: "New Framework", onClick: () => setShowCreate(true) }} />
      ) : (
        <div className="space-y-2">
          {filtered.map((f: any) => (
            <Card key={f.id} className="hover:border-slate-600 transition-colors" data-testid={`framework-card-${f.id}`}>
              <CardContent className="p-3 flex items-center justify-between gap-3">
                <Link href={`/frameworks/${f.id}`} className="flex-1 min-w-0 cursor-pointer">
                  <div className="flex items-center gap-2 min-w-0">
                    <GitBranch className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{f.title}</p>
                        {f.isSeed && <Lock className="h-3 w-3 text-amber-400 flex-shrink-0" />}
                      </div>
                      {f.frameworkType && <p className="text-xs text-muted-foreground capitalize">{f.frameworkType.replace(/_/g," ")}</p>}
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {f.clonable && (
                    <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setCloneTarget(f)} data-testid={`button-clone-framework-${f.id}`}>
                      <Copy className="h-3 w-3 mr-1" />Clone
                    </Button>
                  )}
                  <Button asChild size="icon" variant="ghost" className="h-7 w-7">
                    <Link href={`/frameworks/${f.id}`}><ChevronRight className="h-3.5 w-3.5" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CloneModal open={!!cloneTarget} onClose={() => setCloneTarget(null)} onConfirm={(t) => cloneMutation.mutate({ id: cloneTarget.id, newTitle: t })} entityLabel="Framework" defaultTitle={cloneTarget?.title ?? ""} isLoading={cloneMutation.isPending} />

      <Dialog open={showCreate} onOpenChange={(v) => { if (!v) { setShowCreate(false); setForm({ title: "", frameworkType: "", body: "" }); }}}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>New Framework</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-framework-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Framework Type</Label><Input value={form.frameworkType} onChange={(e) => setForm({ ...form, frameworkType: e.target.value })} placeholder="e.g. approach_selection" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Body</Label><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={5} data-testid="input-framework-body" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!form.title.trim() || createMutation.isPending} data-testid="button-save-framework">{createMutation.isPending ? "Creating..." : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
