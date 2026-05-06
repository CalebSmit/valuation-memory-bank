import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { OutlineTree } from "./OutlineTree";
import { SectionCard } from "./SectionCard";
import {
  type ReportSectionTemplate, type ProjectReportSection, type SectionStatus,
} from "./types";

interface ReportOutlineProps {
  projectId: string;
  workspaceId: string;
  // Existing project data (already loaded by ProjectDetail) — passed in to
  // avoid a second round of fetches and to share invalidation.
  sources: any[];
  assumptions: any[];
  externalModels: any[];
  supportMemos: any[];
  // Inline-create handlers reuse the dialogs that already exist on ProjectDetail.
  onCreateSource?: () => void;
  onCreateAssumption?: () => void;
  onCreateExternalModel?: () => void;
  onCreateSupportMemo?: () => void;
}

export function ReportOutline({
  projectId, workspaceId,
  sources, assumptions, externalModels, supportMemos,
  onCreateSource, onCreateAssumption, onCreateExternalModel, onCreateSupportMemo,
}: ReportOutlineProps) {
  const { data: templates = [], isLoading: loadingTemplates } = useQuery<ReportSectionTemplate[]>({
    queryKey: ["/api/report-section-templates"],
    queryFn: () => api.getReportSectionTemplates(),
    staleTime: 60 * 60 * 1000, // templates rarely change
  });

  const { data: sections = [], isLoading: loadingSections } = useQuery<ProjectReportSection[]>({
    queryKey: ["/api/projects", projectId, "report-sections"],
    queryFn: () => api.getProjectReportSections(projectId),
    enabled: !!projectId,
  });

  const sectionsBySlug = useMemo(() => {
    const map: Record<string, ProjectReportSection> = {};
    for (const s of sections) map[s.templateSlug] = s;
    return map;
  }, [sections]);

  const statusBySlug = useMemo(() => {
    const map: Record<string, SectionStatus> = {};
    for (const s of sections) map[s.templateSlug] = s.status;
    return map;
  }, [sections]);

  const upsertMutation = useMutation({
    mutationFn: ({ slug, patch }: { slug: string; patch: Partial<ProjectReportSection> }) => {
      const existing = sectionsBySlug[slug];
      const merged = {
        body: existing?.body ?? null,
        status: existing?.status ?? "not_started",
        linkedSourceIds: existing?.linkedSourceIds ?? [],
        linkedAssumptionIds: existing?.linkedAssumptionIds ?? [],
        linkedExternalModelIds: existing?.linkedExternalModelIds ?? [],
        linkedSupportMemoIds: existing?.linkedSupportMemoIds ?? [],
        linkedFileIds: existing?.linkedFileIds ?? [],
        externalLinks: existing?.externalLinks ?? [],
        reviewStatus: existing?.reviewStatus ?? "draft",
        ...patch,
      };
      return api.upsertProjectReportSection(projectId, slug, merged);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "report-sections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "report-progress"] });
    },
  });

  // Refs for scroll-to-section
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());
  const registerRef = (slug: string, el: HTMLElement | null) => {
    if (el) cardRefs.current.set(slug, el);
    else cardRefs.current.delete(slug);
  };
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const onSelect = (slug: string) => {
    setActiveSlug(slug);
    const el = cardRefs.current.get(slug);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Track which section is in view as user scrolls (right column drives left highlight).
  useEffect(() => {
    if (templates.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the entry highest on the page
          const top = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b);
          const slug = top.target.getAttribute("data-testid")?.replace("section-card-", "");
          if (slug) setActiveSlug(slug);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    cardRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [templates.length]);

  // Progress tally
  const progress = useMemo(() => {
    const total = templates.length;
    const drafted = sections.filter((s) =>
      s.status === "drafted" || s.status === "reviewed" || s.status === "final",
    ).length;
    const inProgress = sections.filter((s) => s.status === "in_progress").length;
    const pct = total > 0 ? Math.round(((drafted + inProgress * 0.5) / total) * 100) : 0;
    return { total, drafted, inProgress, pct };
  }, [templates, sections]);

  if (loadingTemplates || loadingSections) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="report-outline">
      {/* Progress header */}
      <div className="flex items-center gap-3 px-1">
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{progress.drafted}</span> drafted,{" "}
          <span className="font-medium text-foreground">{progress.inProgress}</span> in progress
          {" / "}
          <span className="font-medium text-foreground">{progress.total}</span> sections
        </div>
        <div className="flex-1">
          <Progress value={progress.pct} className="h-2" />
        </div>
        <div className="text-xs text-muted-foreground tabular-nums">{progress.pct}%</div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
        {/* Left: sticky TOC */}
        <aside className="lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto border border-border rounded-md bg-card/40 p-2">
          <OutlineTree
            templates={templates}
            statusBySlug={statusBySlug}
            activeSlug={activeSlug}
            onSelect={onSelect}
          />
        </aside>

        {/* Right: section cards */}
        <div className="space-y-3">
          {templates
            .slice()
            .sort((a, b) => a.defaultOrder - b.defaultOrder)
            .map((tpl) => (
              <SectionCard
                key={tpl.slug}
                template={tpl}
                section={sectionsBySlug[tpl.slug] ?? null}
                registerRef={registerRef}
                isActive={activeSlug === tpl.slug}
                sources={sources}
                assumptions={assumptions}
                externalModels={externalModels}
                supportMemos={supportMemos}
                onSave={(slug, patch) => upsertMutation.mutate({ slug, patch })}
                onCreateSource={onCreateSource}
                onCreateAssumption={onCreateAssumption}
                onCreateExternalModel={onCreateExternalModel}
                onCreateSupportMemo={onCreateSupportMemo}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
