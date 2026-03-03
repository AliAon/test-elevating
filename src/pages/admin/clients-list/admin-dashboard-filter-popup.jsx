import { CalendarPicker } from "@/components/ui/calendar-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Selector from "@/components/ui/selector";
import { SlidersHorizontal } from "lucide-react";

const AdminDashboardFilterPopup = ({
  title = "Sort By",
  description = "Subscribtion Ending",
  filters,
  setFilters,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
          <SlidersHorizontal size={20} className="text-text_secondary" />
          <p className="text-sm text-text_secondary font-semibold">Filter</p>
        </div>
      </PopoverTrigger>

      {/* Popup Content */}
      <PopoverContent className="w-80 p-4 bg-white shadow-lg rounded-lg border-none">
        <div className="space-y-3">
          <div>
            <p className="text-lg font-semibold">{title}</p>
            <Selector
              options={["newest", "oldest"]}
              triggerClassName="!border-2 p-2"
              parentClassName={"p-0 py-4"}
              placeholder="Recent Joined"
              value={filters.sort}
              onChange={(value) => {
                setFilters({ ...filters, sort: value });
              }}
            />
            {description && (
              <p className="text-base font-semibold">{description}</p>
            )}
          </div>

          <div className="flex justify-between">
            <CalendarPicker
              triggerClassName={"border !p-2"}
              parentClassName={"px-1"}
              placeholder="Date From"
              value={filters.dateFrom}
              onChange={(value) => {
                setFilters({ ...filters, dateFrom: value });
              }}
            />
            <CalendarPicker
              triggerClassName={"border !p-2"}
              parentClassName={"px-1"}
              placeholder="Date To"
              value={filters.dateTo}
              onChange={(value) => {
                setFilters({ ...filters, dateTo: value });
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminDashboardFilterPopup;
