import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-slate-700 text-slate-200 border-slate-600" },
  in_review: { label: "In Review", className: "bg-amber-900/60 text-amber-300 border-amber-700" },
  reviewed: { label: "Reviewed", className: "bg-blue-900/60 text-blue-300 border-blue-700" },
  approved: { label: "Approved", className: "bg-emerald-900/60 text-emerald-300 border-emerald-700" },
  archived: { label: "Archived", className: "bg-slate-800 text-slate-400 border-slate-700" },
};

interface ReviewStatusBadgeProps {
  status: string | null | undefined;
  className?: string;
}

export function ReviewStatusBadge({ status, className }: ReviewStatusBadgeProps) {
  const cfg = statusConfig[status ?? "draft"] ?? statusConfig.draft;
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium ${cfg.className} ${className ?? ""}`}
      data-testid="badge-review-status"
    >
      {cfg.label}
    </Badge>
  );
}
