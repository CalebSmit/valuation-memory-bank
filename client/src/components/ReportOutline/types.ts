export interface ReportSectionTemplate {
  id: string;
  slug: string;
  parentSlug: string | null;
  level: 1 | 2 | 3;
  title: string;
  defaultOrder: number;
  description?: string | null;
  guidance?: string | null;
}

export type SectionStatus =
  | "not_started"
  | "in_progress"
  | "drafted"
  | "reviewed"
  | "final";

export interface ExternalLink {
  label: string;
  url: string;
}

export interface ProjectReportSection {
  id: string;
  workspaceId: string;
  projectId: string;
  templateSlug: string;
  body: string | null;
  status: SectionStatus;
  linkedSourceIds: string[];
  linkedAssumptionIds: string[];
  linkedExternalModelIds: string[];
  linkedSupportMemoIds: string[];
  linkedFileIds: string[];
  externalLinks: ExternalLink[];
  reviewStatus?: string | null;
  updatedAt: string;
}

export const STATUS_OPTIONS: { value: SectionStatus; label: string }[] = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "drafted", label: "Drafted" },
  { value: "reviewed", label: "Reviewed" },
  { value: "final", label: "Final" },
];

export const STATUS_DOT: Record<SectionStatus, string> = {
  not_started: "bg-slate-600",
  in_progress: "bg-amber-400",
  drafted: "bg-blue-400",
  reviewed: "bg-cyan-400",
  final: "bg-emerald-400",
};
