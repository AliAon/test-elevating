import { CalendarPicker } from "@/components/ui/calendar-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsersQuery } from "@/redux/services/auth-api";
import { format } from "date-fns";
import { SlidersHorizontal, X } from "lucide-react";

const AdminLogFilterPopup = ({ filters, setFilters }) => {
  const { data: users } = useGetUsersQuery({
    user_type_id:
      "21661987-bbca-48bb-aa4b-1e6faa4895c8|7c0be78a-8d89-43bd-a014-4d31e6d7f85a",
    limit: 100,
  });
  const usersData = users?.data;

  const clearFilter = (key) => setFilters({ ...filters, [key]: "" });

  const ClearButton = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 ml-2 px-2 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
    >
      <X size={16} />
      <span>Clear</span>
    </button>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
          <SlidersHorizontal size={20} className="text-text_secondary" />
          <p className="text-sm text-text_secondary font-semibold">Filter</p>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4 bg-white shadow-lg rounded-lg border-none">
        <div className="space-y-4">
          {/* Filter by Type */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-semibold">Filter by Type</p>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger className="!border-2 p-2 w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {["Comprehensive", "Non-Comprehensive", "Full Service"].map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            {filters.type && (
              <ClearButton onClick={() => clearFilter("type")} />
            )}
          </div>

          {/* Date Range */}
          <div>
            <p className="text-lg font-semibold">Date Range</p>
            <div className="flex justify-between gap-2">
              <div className="flex-1 flex items-center">
                <CalendarPicker
                  triggerClassName="border !p-2 w-full"
                  parentClassName="px-0"
                  placeholder="Date From"
                  value={filters.dateFrom}
                  onChange={(value) =>
                    setFilters({
                      ...filters,
                      dateFrom: format(value, "yyyy-MM-dd"),
                    })
                  }
                />
                {filters.dateFrom && (
                  <ClearButton onClick={() => clearFilter("dateFrom")} />
                )}
              </div>
              <div className="flex-1 flex items-center">
                <CalendarPicker
                  triggerClassName="border !p-2 w-full"
                  parentClassName="px-0"
                  placeholder="Date To"
                  value={filters.dateTo}
                  onChange={(value) =>
                    setFilters({
                      ...filters,
                      dateTo: format(value, "yyyy-MM-dd"),
                    })
                  }
                />
                {filters.dateTo && (
                  <ClearButton onClick={() => clearFilter("dateTo")} />
                )}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminLogFilterPopup;
