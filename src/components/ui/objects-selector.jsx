import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function SelectorWithObjects({
  label,
  options = [],
  onChange,
  value,
  triggerClassName,
  parentClassName,
  placeholder = "Select an option",
  error,
  disabled,
  required = false,
}) {
  return (
    <div
      className={cn(
        "w-full bg-white rounded-lg px-2 pt-2 pb-2",
        parentClassName,
      )}>
      <p className="text-sm text-text_secondary font-medium">
        {label} {required && "*"}
      </p>

      <Select onValueChange={onChange} value={value}>
        <SelectTrigger
          className={cn(
            "w-full min-h-8 border-0 text-sm text-text_primary font-semibold placeholder:text-text_primary shadow-none bg-gray-50",
            triggerClassName,
          )}
          disabled={disabled}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={"max-h-80"}>
          {options.length === 0 ? (
            <p className="text-center select-none">No options available</p>
          ) : (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
      )}
    </div>
  );
}
