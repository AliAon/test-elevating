import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

export default function MultiSelectorWithCheckbox({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = "Select options",
  triggerClassName,
  parentClassName,
  error,
  disabled,
}) {
  const toggleValue = (val) => {
    if (disabled) return;

    onChange(
      value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
    );
  };

  const selectedLabels = options
    .filter((o) => value.includes(o.value))
    .map((o) => o.label)
    .join(", ");

  return (
    <div
      className={cn(
        "w-full bg-white rounded-lg px-4 pt-4 pb-2",
        parentClassName
      )}
    >
      {label && (
        <p className="mb-1 text-sm font-medium text-text_secondary">{label}</p>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            className={cn(
              "w-full justify-between p-0 h-auto text-sm font-semibold text-text_primary shadow-none",
              triggerClassName
            )}
          >
            <span className="truncate">{selectedLabels || placeholder}</span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        {/* ✅ FULL WIDTH DROPDOWN */}
        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-[var(--radix-popover-trigger-width)] max-h-80 overflow-y-auto p-2"
        >
          {options.length === 0 ? (
            <p className="py-2 text-center text-sm text-muted-foreground">
              No options available
            </p>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                onClick={() => toggleValue(option.value)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
              >
                <Checkbox checked={value.includes(option.value)} />
                <span className="text-sm">{option.label}</span>
              </div>
            ))
          )}
        </PopoverContent>
      </Popover>

      {error && (
        <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}
