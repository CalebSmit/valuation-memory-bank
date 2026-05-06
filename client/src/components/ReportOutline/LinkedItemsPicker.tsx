import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface PickableItem {
  id: string;
  label: string;
  hint?: string;
}

interface LinkedItemsPickerProps {
  label: string;
  testId: string;
  items: PickableItem[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onCreateNew?: () => void;
  emptyMessage?: string;
}

export function LinkedItemsPicker({
  label, testId, items, selectedIds, onChange, onCreateNew,
  emptyMessage = "No items in this project yet.",
}: LinkedItemsPickerProps) {
  const [open, setOpen] = useState(false);
  const selectedItems = items.filter((i) => selectedIds.includes(i.id));

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const remove = (id: string) => onChange(selectedIds.filter((s) => s !== id));

  return (
    <div className="space-y-1.5" data-testid={`linked-${testId}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          {label}
          {selectedItems.length > 0 && (
            <span className="ml-1 text-muted-foreground/70">({selectedItems.length})</span>
          )}
        </span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs px-2"
              data-testid={`button-link-${testId}`}
            >
              <Plus className="h-3 w-3 mr-1" /> Link
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <Command>
              <CommandInput placeholder={`Search ${label.toLowerCase()}...`} className="h-8" />
              <CommandList>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <CommandItem
                        key={item.id}
                        value={`${item.label} ${item.hint ?? ""}`}
                        onSelect={() => toggle(item.id)}
                        className="text-xs"
                        data-testid={`linked-option-${testId}-${item.id}`}
                      >
                        <Check className={cn("h-3 w-3 mr-2", isSelected ? "opacity-100" : "opacity-0")} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.hint && <span className="text-muted-foreground ml-2 truncate">{item.hint}</span>}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {onCreateNew && (
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => { setOpen(false); onCreateNew(); }}
                      className="text-xs text-primary"
                      data-testid={`button-create-new-${testId}`}
                    >
                      <Plus className="h-3 w-3 mr-2" /> Create new
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedItems.map((item) => (
            <Badge
              key={item.id}
              variant="secondary"
              className="text-[10px] gap-1 pr-1"
              data-testid={`linked-pill-${testId}-${item.id}`}
            >
              <span className="truncate max-w-[180px]">{item.label}</span>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="hover:text-destructive"
                aria-label={`Remove ${item.label}`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
