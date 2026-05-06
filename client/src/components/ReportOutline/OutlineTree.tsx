import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ReportSectionTemplate, type SectionStatus, STATUS_DOT } from "./types";

interface OutlineTreeProps {
  templates: ReportSectionTemplate[];
  statusBySlug: Record<string, SectionStatus>;
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}

interface TreeNode {
  template: ReportSectionTemplate;
  children: TreeNode[];
}

function buildTree(templates: ReportSectionTemplate[]): TreeNode[] {
  const bySlug = new Map<string, TreeNode>();
  for (const tpl of templates) {
    bySlug.set(tpl.slug, { template: tpl, children: [] });
  }
  const roots: TreeNode[] = [];
  for (const tpl of templates) {
    const node = bySlug.get(tpl.slug)!;
    if (tpl.parentSlug && bySlug.has(tpl.parentSlug)) {
      bySlug.get(tpl.parentSlug)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const sortRecursive = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => a.template.defaultOrder - b.template.defaultOrder);
    nodes.forEach((n) => sortRecursive(n.children));
  };
  sortRecursive(roots);
  return roots;
}

export function OutlineTree({ templates, statusBySlug, activeSlug, onSelect }: OutlineTreeProps) {
  const tree = useMemo(() => buildTree(templates), [templates]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggle = (slug: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const renderNode = (node: TreeNode): React.ReactNode => {
    const { template: tpl, children } = node;
    const status = statusBySlug[tpl.slug] ?? "not_started";
    const isActive = activeSlug === tpl.slug;
    const isCollapsed = collapsed.has(tpl.slug);
    const hasChildren = children.length > 0;
    const indentClass = tpl.level === 1 ? "pl-2" : tpl.level === 2 ? "pl-5" : "pl-9";
    const sizeClass = tpl.level === 1 ? "text-xs font-semibold uppercase tracking-wider text-foreground/80" :
      tpl.level === 2 ? "text-xs font-medium" : "text-[11px]";

    return (
      <div key={tpl.slug}>
        <div
          className={cn(
            "flex items-center gap-1.5 py-1 pr-2 rounded-md cursor-pointer group",
            indentClass,
            isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
          onClick={() => onSelect(tpl.slug)}
          data-testid={`outline-item-${tpl.slug}`}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggle(tpl.slug); }}
              className="text-muted-foreground hover:text-foreground"
              aria-label={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          ) : (
            <span className="w-3 h-3" />
          )}
          <span className={cn("inline-block w-1.5 h-1.5 rounded-full shrink-0", STATUS_DOT[status])} />
          <span className={cn("truncate flex-1", sizeClass)}>{tpl.title}</span>
        </div>
        {hasChildren && !isCollapsed && (
          <div>{children.map(renderNode)}</div>
        )}
      </div>
    );
  };

  return (
    <nav className="space-y-0.5" data-testid="outline-tree">
      {tree.map(renderNode)}
    </nav>
  );
}
