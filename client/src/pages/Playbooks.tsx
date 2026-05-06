import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { api } from "@/lib/api";
import { useWorkspace } from "@/lib/workspace-context";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { CloneModal } from "@/components/CloneModal";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Plus, Copy, Lock, ChevronRight, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PlaybooksPage() {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const [searchQ, setSearchQ] = useState("");
  const [cloneTarget, setCloneTarget] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", engagementType: "", body: "" });

  const { data: playbooks = [], isLoading } = useQuery({
    queryKey: ["/api/playbooks", workspaceId],
    queryFn: () => api.getPlaybooks(workspaceId),
  });

  const cloneMutation = useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) =>
      api.clonePlaybook(id, { newTitle, targetWorkspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playbooks"] });
      setCloneTarget(null);
      toast({ title: "Playbook cloned to your workspace" });
    },
  });

  const createMutation = useMutation({
    mutationFn: () =>
      api.createPlaybook({ ...form, workspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playbooks"] });
      setShowCreate(false);
      setForm({ title: "", engagementType: "", body: "" });
      toast({ title: "Playbook created" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deletePlaybook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playbooks"] });
      toast({ title: "Playbook deleted" });
    },
  });

  const filtered = playbooks.filter((p: any) => {
    const q = searchQ.toLowerCase();
    return !q || p.title?.toLowerCase().includes(q) || p.engagementType?.toLowerCase().includes(q);
  });

  const seedPlaybooks = filtered.filter((p: any) => p.isSeed);
  const myPlaybooks = filtered.filter((p: any) => !p.isSeed);

  return (
    <div className="space-y-6" data-testid="page-playbooks">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Methodology Playbooks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Step-by-step engagement guides. Clone seed playbooks to customize them.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} data-testid="button-new-playbook">
          <Plus className="h-3.5 w-3.5 mr-1.5" />New Playbook
        </Button>
      </div>

      <Input
        placeholder="Search playbooks..."
        value={searchQ}
        onChange={(e) => setSearchQ(e.target.value)}
        className="max-w-sm"
        data-testid="input-search-playbooks"
      />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No playbooks" description="No playbooks match your search." />
      ) : (
        <>
          {seedPlaybooks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Seed Library (Read-Only)
              </p>
              <div className="space-y-2">
                {seedPlaybooks.map((p: any) => (
                  <PlaybookRow
                    key={p.id}
                    playbook={p}
                    onClone={() => setCloneTarget(p)}
                    onDelete={!p.isSeed ? () => deleteMutation.mutate(p.id) : undefined}
                  />
                ))}
              </div>
            </div>
          )}
          {myPlaybooks.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                My Playbooks
              </p>
              <div className="space-y-2">
                {myPlaybooks.map((p: any) => (
                  <PlaybookRow
                    key={p.id}
                    playbook={p}
                    onClone={() => setCloneTarget(p)}
                    onDelete={() => deleteMutation.mutate(p.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <CloneModal
        open={!!cloneTarget}
        onClose={() => setCloneTarget(null)}
        onConfirm={(newTitle) => cloneMutation.mutate({ id: cloneTarget.id, newTitle })}
        entityLabel="Playbook"
        defaultTitle={cloneTarget?.title ?? ""}
        isLoading={cloneMutation.isPending}
      />

      <Dialog open={showCreate} onOpenChange={(v) => { if (!v) { setShowCreate(false); setForm({ title: "", engagementType: "", body: "" }); }}}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>New Playbook</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-playbook-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Engagement Type</Label>
              <Input value={form.engagementType} onChange={(e) => setForm({ ...form, engagementType: e.target.value })} placeholder="e.g. business_valuation" data-testid="input-playbook-engagement" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Body / Steps</Label>
              <Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={5} placeholder="Describe the playbook steps..." data-testid="input-playbook-body" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!form.title.trim() || createMutation.isPending} data-testid="button-save-playbook">
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PlaybookRow({ playbook, onClone, onDelete }: { playbook: any; onClone: () => void; onDelete?: () => void }) {
  return (
    <Card className="hover:border-slate-600 transition-colors" data-testid={`playbook-card-${playbook.id}`}>
      <CardContent className="p-3 flex items-center justify-between gap-3">
        <Link href={`/playbooks/${playbook.id}`} className="flex-1 min-w-0 cursor-pointer">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="h-4 w-4 text-purple-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">{playbook.title}</p>
                {playbook.isSeed && <Lock className="h-3 w-3 text-amber-400 flex-shrink-0" />}
              </div>
              {playbook.engagementType && (
                <p className="text-xs text-muted-foreground capitalize">
                  {playbook.engagementType.replace(/_/g, " ")}
                </p>
              )}
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-1 flex-shrink-0">
          {playbook.clonable && (
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={onClone} data-testid={`button-clone-playbook-${playbook.id}`}>
              <Copy className="h-3 w-3 mr-1" />Clone
            </Button>
          )}
          <Button asChild size="icon" variant="ghost" className="h-7 w-7">
            <Link href={`/playbooks/${playbook.id}`}><ChevronRight className="h-3.5 w-3.5" /></Link>
          </Button>
          {onDelete && (
            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={onDelete} data-testid={`button-delete-playbook-${playbook.id}`}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
