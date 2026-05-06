import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ExternalLink as ExternalLinkIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type ReportSectionTemplate, type ProjectReportSection, type SectionStatus,
  type ExternalLink, STATUS_OPTIONS, STATUS_DOT,
} from "./types";
import { LinkedItemsPicker } from "./LinkedItemsPicker";

interface ProjectItem { id: string; title?: string; name?: string; question?: string; sourceType?: string; modelType?: string; memoType?: string; }

interface SectionCardProps {
  template: ReportSectionTemplate;
  section: ProjectReportSection | null;
  registerRef: (slug: string, el: HTMLElement | null) => void;
  isActive: boolean;
  // Project items available for linking
  sources: ProjectItem[];
  assumptions: ProjectItem[];
  externalModels: ProjectItem[];
  supportMemos: ProjectItem[];
  // Save handler — fires on debounced edits and immediate status changes
  onSave: (slug: string, patch: Partial<ProjectReportSection>) => void;
  // Allow inline create from picker — opens existing project dialogs
  onCreateSource?: () => void;
  onCreateAssumption?: () => void;
  onCreateExternalModel?: () => void;
  onCreateSupportMemo?: () => void;
}

export function SectionCard({
  template, section, registerRef, isActive,
  sources, assumptions, externalModels, supportMemos,
  onSave,
  onCreateSource, onCreateAssumption, onCreateExternalModel, onCreateSupportMemo,
}: SectionCardProps) {
  const [body, setBody] = useState(section?.body ?? "");
  const [status, setStatus] = useState<SectionStatus>(section?.status ?? "not_started");
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>(section?.externalLinks ?? []);
  const [draftLink, setDraftLink] = useState<ExternalLink>({ label: "", url: "" });

  // Keep local state in sync if parent reloads (e.g. after server save)
  useEffect(() => {
    setBody(section?.body ?? "");
    setStatus(section?.status ?? "not_started");
    setExternalLinks(section?.externalLinks ?? []);
  }, [section?.id, section?.updatedAt]);

  // Debounced body save
  const bodyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleBodyChange = (value: string) => {
    setBody(value);
    // If user starts typing in a not_started section, auto-bump to in_progress
    const nextStatus: SectionStatus =
      value.length > 0 && status === "not_started" ? "in_progress" : status;
    if (nextStatus !== status) setStatus(nextStatus);
    if (bodyTimer.current) clearTimeout(bodyTimer.current);
    bodyTimer.current = setTimeout(() => {
      onSave(template.slug, { body: value, status: nextStatus });
    }, 700);
  };

  const handleStatusChange = (next: string) => {
    const s = next as SectionStatus;
    setStatus(s);
    onSave(template.slug, { status: s });
  };

  const handleLinkedChange = (
    field: "linkedSourceIds" | "linkedAssumptionIds" | "linkedExternalModelIds" | "linkedSupportMemoIds",
    ids: string[],
  ) => {
    onSave(template.slug, { [field]: ids } as Partial<ProjectReportSection>);
  };

  const addExternalLink = () => {
    if (!draftLink.url.trim()) return;
    const next = [...externalLinks, { label: draftLink.label.trim() || draftLink.url, url: draftLink.url.trim() }];
    setExternalLinks(next);
    setDraftLink({ label: "", url: "" });
    onSave(template.slug, { externalLinks: next });
  };

  const removeExternalLink = (idx: number) => {
    const next = externalLinks.filter((_, i) => i !== idx);
    setExternalLinks(next);
    onSave(template.slug, { externalLinks: next });
  };

  const headingClass =
    template.level === 1 ? "text-base font-semibold" :
    template.level === 2 ? "text-sm font-semibold" :
    "text-sm font-medium";

  return (
    <Card
      ref={(el) => registerRef(template.slug, el)}
      className={cn(
        "scroll-mt-20 transition-colors",
        isActive ? "border-primary/60" : "",
      )}
      data-testid={`section-card-${template.slug}`}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn("inline-block w-1.5 h-1.5 rounded-full", STATUS_DOT[status])} />
              <h3 className={headingClass}>{template.title}</h3>
            </div>
            {template.description && (
              <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
            )}
          </div>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-7 w-32 text-xs" data-testid={`status-${template.slug}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Part-level cards have no editor — they're just headers in the outline */}
        {template.level > 1 && (
          <Textarea
            value={body}
            onChange={(e) => handleBodyChange(e.target.value)}
            placeholder="Write your reasoning, findings, or notes for this section. Markdown is fine."
            rows={5}
            className="text-sm"
            data-testid={`body-${template.slug}`}
          />
        )}

        {template.level > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <LinkedItemsPicker
              label="Sources"
              testId={`sources-${template.slug}`}
              items={sources.map((s) => ({ id: s.id, label: s.title ?? "(untitled)", hint: s.sourceType }))}
              selectedIds={section?.linkedSourceIds ?? []}
              onChange={(ids) => handleLinkedChange("linkedSourceIds", ids)}
              onCreateNew={onCreateSource}
              emptyMessage="No sources on this project yet."
            />
            <LinkedItemsPicker
              label="Assumptions"
              testId={`assumptions-${template.slug}`}
              items={assumptions.map((a) => ({ id: a.id, label: a.title ?? a.name ?? "(untitled)" }))}
              selectedIds={section?.linkedAssumptionIds ?? []}
              onChange={(ids) => handleLinkedChange("linkedAssumptionIds", ids)}
              onCreateNew={onCreateAssumption}
              emptyMessage="No assumptions on this project yet."
            />
            <LinkedItemsPicker
              label="External Models"
              testId={`models-${template.slug}`}
              items={externalModels.map((m) => ({ id: m.id, label: m.title ?? "(untitled)", hint: m.modelType }))}
              selectedIds={section?.linkedExternalModelIds ?? []}
              onChange={(ids) => handleLinkedChange("linkedExternalModelIds", ids)}
              onCreateNew={onCreateExternalModel}
              emptyMessage="No external models on this project yet."
            />
            <LinkedItemsPicker
              label="Support Memos"
              testId={`memos-${template.slug}`}
              items={supportMemos.map((m) => ({ id: m.id, label: m.title ?? "(untitled)", hint: m.memoType }))}
              selectedIds={section?.linkedSupportMemoIds ?? []}
              onChange={(ids) => handleLinkedChange("linkedSupportMemoIds", ids)}
              onCreateNew={onCreateSupportMemo}
              emptyMessage="No support memos on this project yet."
            />
          </div>
        )}

        {template.level > 1 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              External Links
              {externalLinks.length > 0 && <span className="ml-1 text-muted-foreground/70">({externalLinks.length})</span>}
            </span>
            {externalLinks.length > 0 && (
              <div className="space-y-1">
                {externalLinks.map((lnk, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <ExternalLinkIcon className="h-3 w-3 text-muted-foreground shrink-0" />
                    <a href={lnk.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate flex-1">
                      {lnk.label}
                    </a>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-5 w-5 text-destructive"
                      onClick={() => removeExternalLink(i)}
                      data-testid={`remove-link-${template.slug}-${i}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={draftLink.label}
                onChange={(e) => setDraftLink({ ...draftLink, label: e.target.value })}
                placeholder="Label (optional)"
                className="h-7 text-xs"
                data-testid={`new-link-label-${template.slug}`}
              />
              <Input
                value={draftLink.url}
                onChange={(e) => setDraftLink({ ...draftLink, url: e.target.value })}
                placeholder="https://..."
                className="h-7 text-xs flex-1"
                data-testid={`new-link-url-${template.slug}`}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={addExternalLink}
                disabled={!draftLink.url.trim()}
                className="h-7 px-2"
                data-testid={`add-link-${template.slug}`}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
