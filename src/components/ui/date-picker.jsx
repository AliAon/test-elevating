import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  label,
  triggerClassName,
  placeholder = "Select a date",
  parentClassName,
  onChange,
  value,
  disabled = false,
  error,
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className={cn(
        "w-full flex flex-col bg-white rounded-2xl border border-[#EAECEF] p-1 px-4",
        parentClassName
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            className={cn(
              "w-full text-left justify-between hover:!bg-white border-none shadow-none text-sm text-[#737373] font-semibold !p-0",
              triggerClassName
            )}
          >
            {value ? (
              new Date(value).toLocaleDateString()
            ) : (
              <span className="text-[#737373]">{placeholder}</span>
            )}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            toYear={2050}
            onSelect={(d) => {
              onChange(d);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
      )}
    </div>
  );
}
