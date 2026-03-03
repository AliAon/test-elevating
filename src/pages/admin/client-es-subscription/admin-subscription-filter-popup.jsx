import SelectorWithObjects from "@/components/ui/objects-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetAllClientsQuery } from "@/redux/services/admin-client";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

const AdminSubscriptionFilterPopup = ({
  filters,
  setFilters,
  isClient = true,
}) => {
  const [open, setOpen] = useState(false);
  const { data: clientsData } = useGetAllClientsQuery({
    filters: { limit: 30 },
  });
  const clients = clientsData?.data;
  const clientOptions = clients?.map((client) => ({
    value: client?.client_id,
    label: client?.client_name,
  }));
  const subOptions = [
    {
      value: "Premium",
      label: "Premium",
    },

    {
      value: "type2",
      label: "Type2",
    },
    {
      value: "type1",
      label: "Type1",
    },
  ];

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
              });
              setOpen(false);
            }}
            className="cursor-pointer"
          />
        </div>
        <div>
          <div>
            <SelectorWithObjects
              label={"Subscription Type"}
              options={subOptions}
              value={filters.subscription_type}
              onChange={(value) => {
                setFilters({ ...filters, subscription_type: value });
              }}
            />
          </div>
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
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminSubscriptionFilterPopup;
