import { CalendarPicker } from "@/components/ui/calendar-picker";
import InputField from "@/components/ui/input-field";
import SelectorWithObjects from "@/components/ui/objects-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@/hooks/useUserType";
import { useGetAllEquipmentsQuery } from "@/redux/services/groups";
import { SlidersHorizontal, X } from "lucide-react";

const CallbacksFilterPopup = ({
  filters,
  setFilters,
  isShowEquipment = true,
}) => {
  const user = useUser();
  const clientId = user?.es_subscriptions[0]?.client_id;
  const { data } = useGetAllEquipmentsQuery(
    {
      client_id: clientId,
      limit: 100,
    },
    {
      skip: !clientId,
    },
  );
  const equipmentList = data?.data;
  const equipmentOptions = equipmentList?.map((equipment) => ({
    value: equipment.equipment_id,
    label: equipment.equipment_name,
  }));
  const subOptions = [
    {
      value: "Closed",
      label: "Closed",
    },

    {
      value: "open",
      label: "Open",
    },
    {
      value: "Planned",
      label: "Planned",
    },
    {
      value: "Completed",
      label: "Completed",
    },
  ];
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

      {/* Popup Content */}
      <PopoverContent className="w-80 bg-white shadow-lg rounded-lg border-none">
        <div className="flex items-end justify-end">
          <X
            size={16}
            onClick={() => {
              setFilters({
                date_from: null,
                date_to: null,
                property: null,
                equipment_id: null,
                status: null,
              });
            }}
            className="cursor-pointer"
          />
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
                value={filters.date_from}
                onChange={(value) =>
                  setFilters({
                    ...filters,
                    date_from: new Date(value).toISOString(),
                  })
                }
              />
              {filters.date_from && (
                <ClearButton onClick={() => clearFilter("date_from")} />
              )}
            </div>
            <div className="flex-1 flex items-center">
              <CalendarPicker
                triggerClassName="border !p-2 w-full"
                parentClassName="px-0"
                placeholder="Date To"
                value={filters.date_to}
                onChange={(value) =>
                  setFilters({
                    ...filters,
                    date_to: new Date(value).toISOString(),
                  })
                }
              />
              {filters.dateTo && (
                <ClearButton onClick={() => clearFilter("date_to")} />
              )}
            </div>
          </div>
        </div>

        {/* Property Name*/}
        <div>
          <InputField
            label="Property Name"
            placeholder="Enter property name"
            onChange={(e) => {
              setFilters({ ...filters, property: e.target.value });
            }}
            value={filters.property}
            name="property"
          />
        </div>

        {/* Equipments */}
        {isShowEquipment && (
          <div>
            <SelectorWithObjects
              label={"Equipment"}
              options={equipmentOptions}
              value={filters.equipment_id}
              placeholder="Equipment Name"
              onChange={(value) => {
                setFilters({ ...filters, equipment_id: value });
              }}
            />
          </div>
        )}

        {/* Status */}
        <div>
          <SelectorWithObjects
            label={"Status"}
            options={subOptions}
            value={filters.status}
            placeholder="Status"
            onChange={(value) => {
              setFilters({ ...filters, status: value });
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CallbacksFilterPopup;
