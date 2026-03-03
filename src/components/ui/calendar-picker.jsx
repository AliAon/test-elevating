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

export function CalendarPicker({
  label,
  triggerClassName,
  placeholder = "Select a date",
  parentClassName,
  onChange,
  value,
  disabled = false,
  error,
  required = false,
  noDate = false,
}) {
  const [open, setOpen] = React.useState(false);
  const parseDate = (v) => {
    if (!v) return undefined;
    // ISO date-only: YYYY-MM-DD → parse as local time to avoid UTC offset shifting the day
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      const parsed = new Date(`${v}T00:00:00`);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    // Locale format: M/D/YYYY or MM/DD/YYYY (returned by some APIs)
    const localeMatch = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (localeMatch) {
      const [, month, day, year] = localeMatch;
      const parsed = new Date(Number(year), Number(month) - 1, Number(day));
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    const parsed = new Date(v);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  };

  const [date, setDate] = React.useState(() => parseDate(value));

  React.useEffect(() => {
    setDate(parseDate(value));
  }, [value]);

  return (
    <div
      className={cn(
        "w-full flex flex-col bg-white rounded-lg px-4 pt-4 pb-2",
        parentClassName,
      )}
    >
      <label htmlFor="date" className="text-sm text-text_secondary font-medium">
        {label} <span className="text-red-500">{required && `*`}</span>
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            id="date"
            className={cn(
              "w-full rounded-sm text-left justify-between border-none shadow-none text-sm text-text_primary font-semibold border-2 !py-0 px-4",
              triggerClassName,
            )}
          >
            {date && date !== "" ? (
              noDate ? (
                new Date(date)?.toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                })
              ) : (
                new Date(date)?.toLocaleDateString("en-US")
              )
            ) : (
              <span className="text-text_secondary/30">{placeholder}</span>
            )}

            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout={noDate ? "" : "dropdown"}
            toYear={2050}
            classNames={{}}
            onSelect={(selectedDate) => {
              if (!selectedDate) return;

              const cleanDate = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
              );

              setDate(cleanDate);
              setOpen(false);

              onChange(cleanDate.toLocaleDateString("en-US"));
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
