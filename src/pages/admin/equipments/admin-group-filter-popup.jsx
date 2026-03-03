import SelectorWithObjects from "@/components/ui/objects-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetAllClientsQuery } from "@/redux/services/admin-client";
import { useGetContractsQuery } from "@/redux/services/contract";
import { useGetSubscriptionsQuery } from "@/redux/services/subscription";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

const AdminGroupFilterPopup = ({ filters, setFilters }) => {
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
  const { data } = useGetContractsQuery({
    filters: { limit: 30 },
  });
  const contracts = data?.data;
  const contractOptions = contracts?.contracts?.map((contract) => ({
    value: contract?.contract_id,
    label: contract?.contract_name,
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
                es_subscription_id: "",
                client_id: "",
                service_contract_id: "",
              });
              setOpen(false);
            }}
            className="cursor-pointer"
          />
        </div>
        <div>
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
            <SelectorWithObjects
              label={"Client"}
              options={clientOptions}
              value={filters.client_id}
              onChange={(value) => {
                setFilters({ ...filters, client_id: value });
              }}
            />
          </div>
          <div>
            <SelectorWithObjects
              label={"Service Contract"}
              options={contractOptions}
              value={filters.service_contract_id}
              onChange={(value) => {
                setFilters({ ...filters, service_contract_id: value });
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminGroupFilterPopup;
