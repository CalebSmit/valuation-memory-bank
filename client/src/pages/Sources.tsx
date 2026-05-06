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
import { useToast } from "@/hooks/use-toast";
import { Link2, Plus, ExternalLink, Trash2, Star } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const SOURCE_TYPES = [
  "management_report","financial_statement","tax_return","industry_report",
  "market_data","guideline_transaction","court_record","appraisal_report","other",
];

export default function SourcesPage() {
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const [searchQ, setSearchQ] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "", sourceType: "management_report", url: "",
    description: "", reliabilityScore: "3",
  });

  const { data: sources = [], isLoading } = useQuery({
    queryKey: ["/api/sources", workspaceId],
    queryFn: () => api.getSources(workspaceId),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      api.createSource({
        ...form,
        workspaceId: workspaceId ?? "ws_default",
        reliabilityScore: Number(form.reliabilityScore),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sources"] });
      setShowCreate(false);
      setForm({ title: "", sourceType: "management_report", url: "", description: "", reliabilityScore: "3" });
      toast({ title: "Source added" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteSource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sources"] });
      toast({ title: "Source deleted" });
    },
  });

  const filtered = sources.filter((s: any) => {
    const q = searchQ.toLowerCase();
    return !q || s.title?.toLowerCase().includes(q) || s.sourceType?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6" data-testid="page-sources">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Sources</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Data sources, references, and evidence links</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} data-testid="button-new-source">
          <Plus className="h-3.5 w-3.5 mr-1.5" />Add Source
        </Button>
      </div>

      <Input placeholder="Search sources..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="max-w-sm" data-testid="input-search-sources" />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Link2} title="No sources" description="Add data sources used in your engagements." action={{ label: "Add Source", onClick: () => setShowCreate(true) }} />
      ) : (
        <div className="space-y-2">
          {filtered.map((s: any) => (
            <Card key={s.id} className="hover:border-slate-600 transition-colors" data-testid={`source-card-${s.id}`}>
              <CardContent className="p-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0 flex-1">
                  <Link2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <Badge variant="outline" className="text-xs">{s.sourceType?.replace(/_/g, " ")}</Badge>
                      {s.reliabilityScore && (
                        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 text-yellow-400" />{s.reliabilityScore}/5
                        </span>
                      )}
                    </div>
                    {s.url && (
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1">
                        <ExternalLink className="h-2.5 w-2.5" />{s.url}
                      </a>
                    )}
                    {s.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.description}</p>}
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive flex-shrink-0" onClick={() => deleteMutation.mutate(s.id)} data-testid={`button-delete-source-${s.id}`}><Trash2 className="h-3.5 w-3.5" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={(v) => { if (!v) setShowCreate(false); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Add Source</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs text-muted-foreground mb-1 block">Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-source-title" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Source Type</Label>
              <Select value={form.sourceType} onValueChange={(v) => setForm({ ...form, sourceType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SOURCE_TYPES.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g," ")}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">URL / Path</Label><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." data-testid="input-source-url" /></div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Reliability Score (1–5)</Label>
              <Select value={form.reliabilityScore} onValueChange={(v) => setForm({ ...form, reliabilityScore: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["1","2","3","4","5"].map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs text-muted-foreground mb-1 block">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!form.title.trim() || createMutation.isPending} data-testid="button-save-source">{createMutation.isPending ? "Adding..." : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
