import SelectorWithObjects from "@/components/ui/objects-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

const EquipmentFilterPopup = ({ filters, setFilters }) => {
  const [open, setOpen] = useState(false);
  const equipmentOptions = [
    {
      value: "ESCALATOR",
      label: "ESCALATOR",
    },
    {
      value: "MOVING WAL",
      label: "MOVING WAL",
    },
    {
      value: "PLATFORM",
      label: "PLATFORM",
    },
    {
      value: "DUMB WAITER",
      label: "DUMB WAITER",
    },
    {
      value: "ELEVATOR",
      label: "ELEVATOR",
    },
  ];

  return (
    <Popover
      defaultOpen={false}
      open={open}
      onOpenChange={(open) => setOpen(open)}
    >
      <PopoverTrigger asChild>
        <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
          <SlidersHorizontal size={20} className="text-text_secondary" />
          <p className="text-sm text-text_secondary font-semibold">Filter</p>
        </div>
      </PopoverTrigger>

      {/* Popup Content */}
      <PopoverContent className="w-80 bg-white shadow-lg rounded-lg border-none">
        <div className="flex items-end justify-end">
          <X
            size={16}
            onClick={() => {
              setOpen(false);
              setFilters({
                equipmentType: null,
              });
            }}
            className="cursor-pointer"
          />
        </div>

        {/* Status */}
        <div>
          <SelectorWithObjects
            label={"Equipment Type"}
            options={equipmentOptions}
            value={filters.equipmentType}
            placeholder="Equipment Type"
            onChange={(value) => {
              setFilters({ ...filters, equipmentType: value });
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EquipmentFilterPopup;
