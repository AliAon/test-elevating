import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export function Switch({
  checked,
  onCheckedChange,
  checkedLabel = "Available",
  uncheckedLabel = "Not Available",
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "text-sm font-semibold",
          checked ? "text-text_primary" : "text-text_secondary"
        )}
      >
        {checked ? checkedLabel : uncheckedLabel}
      </span>

      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(
          "relative inline-flex h-8 w-13 cursor-pointer items-center rounded-full transition-colors border-2",
          checked
            ? "bg-primary border-primary"
            : "bg-transparent border-text_secondary"
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "inline-block size-[26px] rounded-full shadow-md transform transition-transform",
            checked
              ? "translate-x-[22px] bg-white"
              : "translate-x-[2px] bg-text_secondary"
          )}
        >
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center text-[10px] font-bold"
            )}
          >
            {checked ? (
              <Check size={16} className="text-primary" />
            ) : (
              <X size={16} className="text-white" />
            )}
          </span>
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
    </div>
  );
}
