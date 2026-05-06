import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagPillsProps {
  tags: string[];
  onRemove?: (tag: string) => void;
  className?: string;
}

export function TagPills({ tags, onRemove, className }: TagPillsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className ?? ""}`} data-testid="tag-pills">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="text-xs bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 gap-1"
          data-testid={`tag-pill-${tag}`}
        >
          {tag}
          {onRemove && (
            <button
              className="ml-0.5 hover:text-red-400 transition-colors"
              onClick={() => onRemove(tag)}
              data-testid={`button-remove-tag-${tag}`}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
}
