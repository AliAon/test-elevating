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

const CapitalBudgetFilterPopup = ({ filters, setFilters }) => {
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
  const yearOptions = [
    {
      value: 2010,
      label: 2010,
    },
    {
      value: 2020,
      label: 2020,
    },
    {
      value: 2030,
      label: 2030,
    },
    {
      value: 2040,
      label: 2040,
    },
    {
      value: 2050,
      label: 2050,
    },
  ];

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
                property: null,
                equipment_id: null,
                year: null,
              });
            }}
            className="cursor-pointer"
          />
        </div>

        {/* Year */}
        <div>
          <SelectorWithObjects
            label={"Year"}
            options={yearOptions}
            value={filters?.year}
            placeholder="Year Name"
            onChange={(value) => {
              setFilters({ ...filters, year: value });
            }}
          />
        </div>

        {/* Property Name*/}
        <div>
          <InputField
            label="Property Name"
            placeholder="Enter property name"
            onChange={(e) => {
              setFilters({ ...filters, property: e.target.value });
            }}
            value={filters?.property}
            name="property"
          />
        </div>

        {/* Equipments */}
        <div>
          <SelectorWithObjects
            label={"Equipment"}
            options={equipmentOptions}
            value={filters?.equipment_id}
            placeholder="Equipment Name"
            onChange={(value) => {
              setFilters({ ...filters, equipment_id: value });
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CapitalBudgetFilterPopup;
