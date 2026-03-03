import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const DEFAULT_OPTIONS = ["option1", "option2", "option3"];

export default function Selector({
  label,
  options = DEFAULT_OPTIONS,
  onChange,
  value,
  triggerClassName,
  parentClassName,
  placeholder = "Select an option",
  error,
  disabled,
  labelClassName,
}) {
  return (
    <div
      className={cn(
        "w-full bg-white rounded-lg px-4 pt-1 pb-1",
        parentClassName
      )}
    >
      <p
        className={cn(
          "text-sm text-text_secondary font-medium",
          labelClassName
        )}
      >
        {label}
      </p>

      <Select onValueChange={onChange} value={value}>
        <SelectTrigger
          disabled={disabled}
          className={cn(
            "w-full min-h-8 border-0 text-sm text-text_primary font-semibold p-0 placeholder:text-text_primary shadow-none",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
      )}
    </div>
  );
}
