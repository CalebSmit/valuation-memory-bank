import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReadOnlyBannerProps {
  onClone?: () => void;
  entityName?: string;
}

export function ReadOnlyBanner({ onClone, entityName = "this item" }: ReadOnlyBannerProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-amber-700/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-300 mb-6"
      data-testid="banner-read-only"
    >
      <Lock className="h-4 w-4 flex-shrink-0" />
      <span className="flex-1">
        This is a read-only seed item. Clone it to create an editable copy in your workspace.
      </span>
      {onClone && (
        <Button
          size="sm"
          variant="outline"
          className="border-amber-700 text-amber-300 hover:bg-amber-900/40 hover:text-amber-200 text-xs"
          onClick={onClone}
          data-testid="button-clone-from-banner"
        >
          Clone {entityName}
        </Button>
      )}
    </div>
  );
}
