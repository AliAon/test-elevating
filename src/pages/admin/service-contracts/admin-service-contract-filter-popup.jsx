import MultiSelectorWithCheckbox from "@/components/common/multi-selector-with-checkbox";
import { CalendarPicker } from "@/components/ui/calendar-picker";
import SelectorWithObjects from "@/components/ui/objects-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetAllClientsQuery } from "@/redux/services/admin-client";
import { useGetAllBrandQuery } from "@/redux/services/brand-api";
import {
  useGetLvl3BySubscriptionIdQuery,
  useGetSubscriptionsQuery,
} from "@/redux/services/subscription";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

const AdminServiceContractFilterPopup = ({
  filters,
  setFilters,
  isClient = true,
}) => {
  const [open, setOpen] = useState(false);
  const { data: subscriptionsList } = useGetSubscriptionsQuery({
    limit: 30,
  });
  const subscriptions = subscriptionsList?.data;
  const subOptions = subscriptions?.map((sub) => ({
    value: sub.subscription_id,
    label: sub.es_subscription_name,
  }));
  const { data: clientsData } = useGetAllClientsQuery({
    filters: { limit: 30 },
  });
  const clients = clientsData?.data;
  const clientOptions = clients?.map((client) => ({
    value: client?.client_id,
    label: client?.client_name,
  }));

  const { data: brandData } = useGetAllBrandQuery({ limit: 30 });
  const brand = brandData?.data?.brands;
  const brandOptions = brand?.map((brand) => ({
    value: brand?.id,
    label: brand?.brand_name,
  }));
  const contractTypeOptions = [
    { value: "Non-Comprehensive", label: "Non-Comprehensive" },
    { value: "Semi-Comprehensive", label: "Semi-Comprehensive" },
    { value: "Comprehensive", label: "Comprehensive" },
  ];
  const { data: lv3 } = useGetLvl3BySubscriptionIdQuery({ limit: 10 });
  const lvl3s = lv3?.data || [];

  const lvl3Options = lvl3s?.map((level3) => ({
    value: level3?.id,
    label: level3?.name,
  }));

  return (
    <Popover open={open} onOpenChange={(open) => setOpen(open)}>
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
                clientId: "",
                es_subscription_id: "",
                buildingIds: [],
                contractType: "",
                brand_id: "",
              });
              setOpen(false);
            }}
            className="cursor-pointer"
          />
        </div>
        <div>
          {isClient && (
            <div>
              <SelectorWithObjects
                label={"Client"}
                options={clientOptions}
                value={filters.clientId}
                onChange={(value) => {
                  setFilters({ ...filters, clientId: value });
                }}
              />
            </div>
          )}
          <div>
            <SelectorWithObjects
              label={"Subscription"}
              options={subOptions}
              value={filters.es_subscription_id}
              onChange={(value) => {
                setFilters({ ...filters, es_subscription_id: value });
              }}
            />
          </div>
          <div>
            <MultiSelectorWithCheckbox
              label="Building"
              options={lvl3Options}
              value={filters?.buildingIds}
              onChange={(val) => {
                setFilters({ ...filters, buildingIds: val });
              }}
            />
          </div>
          <div>
            <SelectorWithObjects
              label={"Contract Type"}
              options={contractTypeOptions}
              value={filters.contractType}
              onChange={(value) => {
                setFilters({ ...filters, contractType: value });
              }}
            />
          </div>
          <div>
            <SelectorWithObjects
              label={"Brand"}
              options={brandOptions}
              value={filters.brand_id}
              onChange={(value) => {
                setFilters({ ...filters, brand_id: value });
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminServiceContractFilterPopup;
