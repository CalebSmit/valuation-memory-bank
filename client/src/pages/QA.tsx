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
import { MessageSquare, Plus, Copy, Lock, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function QAPage() {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const [searchQ, setSearchQ] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [cloneTarget, setCloneTarget] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ question: "", answer: "", category: "methodology" });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["/api/qa", workspaceId],
    queryFn: () => api.getQaItems(workspaceId),
  });

  const cloneMutation = useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) =>
      api.cloneQaItem(id, { newTitle, targetWorkspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/qa"] });
      setCloneTarget(null);
      toast({ title: "Q&A item cloned" });
    },
  });

  const createMutation = useMutation({
    mutationFn: () => api.createQaItem({ ...form, workspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/qa"] });
      setShowCreate(false);
      setForm({ question: "", answer: "", category: "methodology" });
      toast({ title: "Q&A item created" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateQaItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/qa"] });
      setEditItem(null);
      toast({ title: "Updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteQaItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/qa"] });
      toast({ title: "Deleted" });
    },
  });

  const filtered = items.filter((i: any) => {
    const q = searchQ.toLowerCase();
    return !q || i.question?.toLowerCase().includes(q) || i.answer?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6" data-testid="page-qa">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Q&A Bank</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Reviewer questions, client questions, and answers</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} data-testid="button-new-qa"><Plus className="h-3.5 w-3.5 mr-1.5" />Add Q&A</Button>
      </div>

      <Input placeholder="Search Q&A..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="max-w-sm" data-testid="input-search-qa" />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No Q&A items" description="Build a library of common reviewer and client questions." action={{ label: "Add Q&A", onClick: () => setShowCreate(true) }} />
      ) : (
        <div className="space-y-2">
          {filtered.map((item: any) => {
            const isExpanded = expanded === item.id;
            return (
              <Card key={item.id} className="hover:border-slate-600 transition-colors" data-testid={`qa-card-${item.id}`}>
                <CardContent className="p-0">
                  <div className="flex items-center gap-2 p-3 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : item.id)}>
                    {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
                    <MessageSquare className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
                    <p className="text-sm font-medium flex-1 min-w-0 truncate">{item.question}</p>
                    <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      {item.isSeed && <Lock className="h-3 w-3 text-amber-400" />}
                      {item.clonable && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setCloneTarget(item)} data-testid={`button-clone-qa-${item.id}`}><Copy className="h-3 w-3" /></Button>}
                      {!item.isSeed && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditItem(item)} data-testid={`button-edit-qa-${item.id}`}><Pencil className="h-3 w-3" /></Button>}
                      {!item.isSeed && <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(item.id)} data-testid={`button-delete-qa-${item.id}`}><Trash2 className="h-3 w-3" /></Button>}
                    </div>
                  </div>
                  {isExpanded && item.answer && (
                    <div className="border-t border-border px-4 py-3">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Answer:</p>
                      <p className="text-sm text-slate-300">{item.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CloneModal open={!!cloneTarget} onClose={() => setCloneTarget(null)} onConfirm={(t) => cloneMutation.mutate({ id: cloneTarget.id, newTitle: t })} entityLabel="Q&A Item" defaultTitle={cloneTarget?.question ?? ""} isLoading={cloneMutation.isPending} />

      {/* Create */}
      <Dialog open={showCreate} onOpenChange={(v) => { if (!v) setShowCreate(false); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Q&A Item</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Question *</Label><Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} data-testid="input-qa-question" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Answer</Label><Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} data-testid="input-qa-answer" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["methodology","assumptions","normalization","market_approach","income_approach","dlom","level_of_value","compliance","other"].map(c => <SelectItem key={c} value={c}>{c.replace(/_/g," ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!form.question.trim() || createMutation.isPending} data-testid="button-save-qa">{createMutation.isPending ? "Saving..." : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      {editItem && (
        <Dialog open={!!editItem} onOpenChange={(v) => !v && setEditItem(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Q&A</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div><Label className="text-xs text-muted-foreground mb-1 block">Question</Label><Input value={editItem.question} onChange={(e) => setEditItem({ ...editItem, question: e.target.value })} /></div>
              <div><Label className="text-xs text-muted-foreground mb-1 block">Answer</Label><Textarea value={editItem.answer ?? ""} onChange={(e) => setEditItem({ ...editItem, answer: e.target.value })} rows={4} /></div>
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
