import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { Library, ChevronRight, Lock, Calendar, Building } from "lucide-react";

export default function ReferenceCasesPage() {
  const { data: cases = [], isLoading } = useQuery({
    queryKey: ["/api/reference-cases"],
    queryFn: () => api.getReferenceCases(),
  });

  return (
    <div className="space-y-6" data-testid="page-reference-cases">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Reference Case Library</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Read-only historical engagements with structured artifacts. Clone individual artifacts into your workspace.
        </p>
      </div>

      {/* Isolation notice */}
      <div className="rounded-lg border border-blue-700/40 bg-blue-950/20 px-4 py-3 text-sm text-blue-300 flex items-start gap-2">
        <Library className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          Reference cases are separate from projects. They serve as historical examples — not active engagements.
          To use an artifact, click into the case and clone the artifact you need.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2].map(i => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : cases.length === 0 ? (
        <EmptyState icon={Library} title="No reference cases" description="No reference cases have been loaded." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((rc: any) => (
            <Link key={rc.id} href={`/reference-cases/${rc.caseId}`}>
              <Card
                className="cursor-pointer hover:border-slate-600 transition-colors h-full"
                data-testid={`reference-case-card-${rc.caseId}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <Library className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <CardTitle className="text-sm font-semibold text-foreground truncate">
                          {rc.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{rc.caseId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Lock className="h-3 w-3 text-amber-400" />
                      <Badge variant="outline" className="text-xs border-amber-700/50 text-amber-400">Reference Only</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {rc.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{rc.description}</p>}
                  <div className="flex items-center gap-3 flex-wrap">
                    {rc.entityName && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Building className="h-2.5 w-2.5" />{rc.entityName}
                      </span>
                    )}
                    {rc.valuationDate && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5" />{rc.valuationDate}
                      </span>
                    )}
                    {rc.engagementType && (
                      <span className="text-xs text-slate-500 capitalize">{rc.engagementType.replace(/_/g," ")}</span>
                    )}
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      View Artifacts <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
