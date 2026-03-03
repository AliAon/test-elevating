import SelectorWithObjects from "@/components/ui/objects-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { equipmentTypeOptions } from "@/helpers/constant";
import { useGetLvl3BySubscriptionIdQuery } from "@/redux/services/subscription";
import { SlidersHorizontal, X } from "lucide-react";

const AdminEquipeentFilterPopup = ({ filters, setFilters }) => {
  const { data: lv3 } = useGetLvl3BySubscriptionIdQuery({ limit: 10 });
  const lvl3s = lv3?.data || [];

  const lvl3Options = lvl3s?.map((level3) => ({
    value: level3?.id,
    label: level3?.name,
  }));
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
                equipmentType: "",
                buildingId: "",
              });
            }}
            className="cursor-pointer"
          />
        </div>
        <div>
          <div>
            <SelectorWithObjects
              label={"Equipment Type"}
              options={equipmentTypeOptions}
              value={filters.equipmentType}
              onChange={(value) => {
                setFilters({ ...filters, equipmentType: value });
              }}
            />
          </div>
          <div>
            <SelectorWithObjects
              label={"Building Id"}
              options={lvl3Options}
              value={filters.buildingId}
              onChange={(value) => {
                setFilters({ ...filters, buildingId: value });
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminEquipeentFilterPopup;
