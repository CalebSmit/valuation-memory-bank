import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";

interface CloneModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (newTitle: string) => void;
  entityLabel: string;
  defaultTitle?: string;
  isLoading?: boolean;
}

export function CloneModal({
  open,
  onClose,
  onConfirm,
  entityLabel,
  defaultTitle = "",
  isLoading = false,
}: CloneModalProps) {
  const [title, setTitle] = useState(defaultTitle ? `${defaultTitle} (Copy)` : "");

  function handleOpen(val: boolean) {
    if (!val) onClose();
  }

  function handleConfirm() {
    if (!title.trim()) return;
    onConfirm(title.trim());
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md" data-testid="modal-clone">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Clone {entityLabel}
          </DialogTitle>
          <DialogDescription>
            Create an editable copy in your workspace. The original remains read-only.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <Label htmlFor="clone-title" className="text-sm text-muted-foreground mb-1 block">
              New Title
            </Label>
            <Input
              id="clone-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title for the clone..."
              data-testid="input-clone-title"
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading} data-testid="button-clone-cancel">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!title.trim() || isLoading}
            data-testid="button-clone-confirm"
          >
            {isLoading ? "Cloning..." : "Clone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
