import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useWorkspace } from "@/lib/workspace-context";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CloneModal } from "@/components/CloneModal";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Library, Lock, Copy, Building, Calendar, ChevronDown, ChevronRight,
} from "lucide-react";

export default function ReferenceCaseDetail() {
  const [, params] = useRoute("/reference-cases/:caseId");
  const { workspaceId } = useWorkspace();
  const { toast } = useToast();
  const caseId = params?.caseId ?? "";
  const [expandedArtifact, setExpandedArtifact] = useState<string | null>(null);
  const [cloneTarget, setCloneTarget] = useState<any>(null);

  const { data: refCase, isLoading: loadingCase } = useQuery({
    queryKey: ["/api/reference-cases", caseId],
    queryFn: () => api.getReferenceCase(caseId),
    enabled: !!caseId,
  });

  const { data: artifacts = [], isLoading: loadingArtifacts } = useQuery({
    queryKey: ["/api/reference-cases", caseId, "artifacts"],
    queryFn: () => api.getReferenceArtifacts(caseId),
    enabled: !!caseId,
  });

  const cloneArtifactMutation = useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) =>
      api.cloneReferenceArtifact(id, { newTitle, targetWorkspaceId: workspaceId ?? "ws_default" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support-memos"] });
      setCloneTarget(null);
      toast({ title: "Artifact cloned to workspace support memos" });
    },
  });

  if (loadingCase) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!refCase) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Reference case not found.</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href="/reference-cases">Back to Reference Cases</Link>
        </Button>
      </div>
    );
  }

  const ARTIFACT_TYPE_COLORS: Record<string, string> = {
    company_profile: "border-blue-700/50 text-blue-300",
    income_approach: "border-emerald-700/50 text-emerald-300",
    market_approach: "border-cyan-700/50 text-cyan-300",
    dlom: "border-amber-700/50 text-amber-300",
    reviewer_qa: "border-purple-700/50 text-purple-300",
    lessons_learned: "border-rose-700/50 text-rose-300",
    report_language: "border-indigo-700/50 text-indigo-300",
    regression_fixture: "border-orange-700/50 text-orange-300",
  };

  return (
    <div className="space-y-6 max-w-4xl" data-testid="page-reference-case-detail">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/reference-cases"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold text-foreground">{refCase.title}</h1>
            <Lock className="h-4 w-4 text-amber-400" />
            <Badge variant="outline" className="text-xs border-amber-700/50 text-amber-400">Reference Only</Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">case_id: {refCase.caseId}</p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {refCase.entityName && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Building className="h-2.5 w-2.5" />{refCase.entityName}
              </span>
            )}
            {refCase.valuationDate && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />{refCase.valuationDate}
              </span>
            )}
            {refCase.engagementType && (
              <span className="text-xs text-slate-500 capitalize">{refCase.engagementType.replace(/_/g," ")}</span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {refCase.description && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{refCase.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Isolation notice */}
      <div className="rounded-lg border border-amber-700/30 bg-amber-950/20 px-4 py-3 text-xs text-amber-300 flex items-start gap-2">
        <Library className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
        <p>
          This reference case (<strong>{refCase.caseId}</strong>) is read-only. It is not a project.
          Clone individual artifacts below to use them in your workspace support memos.
        </p>
      </div>

      {/* Artifacts */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Artifacts ({artifacts.length})</h2>
        {loadingArtifacts ? (
          <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : artifacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No artifacts for this case.</p>
        ) : (
          <div className="space-y-2">
            {artifacts.map((artifact: any) => {
              const colorClass = ARTIFACT_TYPE_COLORS[artifact.artifactType] ?? "border-slate-700 text-slate-300";
              const isExpanded = expandedArtifact === artifact.id;
              return (
                <Card key={artifact.id} className="hover:border-slate-600 transition-colors" data-testid={`artifact-card-${artifact.id}`}>
                  <CardContent className="p-0">
                    <div
                      className="flex items-center justify-between gap-3 p-3 cursor-pointer"
                      onClick={() => setExpandedArtifact(isExpanded ? null : artifact.id)}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{artifact.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">{artifact.caseId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="outline" className={`text-xs ${colorClass}`}>
                          {artifact.artifactType?.replace(/_/g, " ")}
                        </Badge>
                        {artifact.clonable && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7"
                            onClick={(e) => { e.stopPropagation(); setCloneTarget(artifact); }}
                            data-testid={`button-clone-artifact-${artifact.id}`}
                          >
                            <Copy className="h-3 w-3 mr-1" />Clone
                          </Button>
                        )}
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t border-border px-4 py-4">
                        <MarkdownViewer content={artifact.body} />
                        {artifact.evidenceUrls && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Evidence Links:</p>
                            <div className="space-y-1">
                              {(Array.isArray(artifact.evidenceUrls) ? artifact.evidenceUrls : JSON.parse(artifact.evidenceUrls || "[]")).map((url: string, i: number) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline block truncate">{url}</a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <CloneModal
        open={!!cloneTarget}
        onClose={() => setCloneTarget(null)}
        onConfirm={(newTitle) => cloneArtifactMutation.mutate({ id: cloneTarget.id, newTitle })}
        entityLabel="Artifact"
        defaultTitle={cloneTarget?.title ?? ""}
        isLoading={cloneArtifactMutation.isPending}
      />
    </div>
  );
}
