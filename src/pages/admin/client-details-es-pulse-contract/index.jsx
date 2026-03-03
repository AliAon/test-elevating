import { ContactListSkeleton } from "@/components/skeleton/contact-row-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetSubscriptionByClientIdQuery } from "@/redux/services/subscription";
import dayjs from "dayjs";
import { ChevronsUpDown, CirclePlus, SlidersHorizontal } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ClientDetailsEsPulseContract() {
  const [params] = useSearchParams();
  const clientId = params.get("clientId");
  const navigate = useNavigate();

  const { data, isLoading } = useGetSubscriptionByClientIdQuery(clientId, {
    skip: !clientId,
  });

  const subscriptions = data?.data;

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-text_primary font-semibold">
          ES Pluse Subscriptions
        </p>
        <div className="flex items-center gap-4">
          <div className="relative w-[260px] h-11 bg-gradient-to-r from-[#FFCBB6] to-primary/0 rounded-2xl p-[1px]">
            <img
              src="/assets/svg/search.svg"
              alt=""
              width={24}
              height={24}
              className="absolute top-1/2 -translate-y-1/2 left-5"
            />
            <Input
              placeholder="Search for the name"
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            />
          </div>
          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <SlidersHorizontal size={20} className="text-text_secondary" />
            <p className="text-sm text-text_secondary font-semibold">Filter</p>
          </div>

          <Button
            className="w-[207px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary"
            onClick={() => navigate(`/admin/es-contracts-add`)}
          >
            <CirclePlus size={18} />
            Add ES Pluse Contract
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-8">
        <TableHeader />
        <div className="mt-2 min-w-[700px] space-y-2">
          {isLoading ? (
            <ContactListSkeleton count={10} />
          ) : (
            subscriptions?.map((row) => (
              <TableRow key={row?.subscription_id} row={row} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const TableHeader = () => {
  return (
    <div className="min-w-[700px] h-8 flex items-center justify-between">
      <div className="w-[300px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Subscription
        <ChevronsUpDown size={16} />
      </div>

      <div className="w-[150px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Sub. Value
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        Start and End
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[150px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        No. of Buildings
        <ChevronsUpDown size={16} />
      </div>
      <div className="w-[150px] flex items-center gap-2 text-xs text-text_secondary font-medium px-4">
        No of Equipment
        <ChevronsUpDown size={16} />
      </div>
    </div>
  );
};

function TableRow({ row }) {
  return (
    <div className="w-full flex items-start justify-between bg-white rounded-2xl">
      <div className="w-[300px] p-4 space-y-1">
        <p className="text-sm text-text_primary font-semibold">
          {row?.es_subscription_name}
        </p>
        <p className="text-xs text-text_secondary font-medium">
          ID. {row?.es_subscription_number}
        </p>
        <p className="text-xs text-text_secondary font-medium">
          By {row?.client_name}
        </p>
      </div>
      <div className="w-[150px] p-4 space-y-1">
        <p className="text-sm text-text_primary font-semibold">
          ${(row?.subscription_price || 0).toLocaleString("en-US")}
        </p>
      </div>

      <div className="w-[200px] flex items-start gap-2 p-4">
        <img src="/assets/svg/connector.svg" alt="" width={14} height={40} />
        <div className="space-y-1">
          <p className="text-sm text-text_primary font-semibold">
            {dayjs(row?.start_date).format("MMM DD, YYYY")}
          </p>
          <p className="text-xs text-text_secondary font-medium">
            {dayjs(row?.end_date).format("MMM DD, YYYY")}
          </p>
          <p
            className={cn(
              "text-xs 8CAA00] font-medium",
              row?.days_remaining < 0
                ? "text-[#C2285A]"
                : row?.days_remaining < 16
                  ? "text-[#F06B3C]"
                  : "text-[#248EA5]",
            )}
          >
            {row?.days_remaining} Days left
          </p>
        </div>
      </div>

      <div className="w-[150px] p-4 space-y-1">
        <p className="text-sm text-text_primary font-semibold">
          {row?.building_ids?.length}
        </p>
      </div>

      <div className="w-[150px] p-4 space-y-1">
        <p className="text-sm text-text_primary font-semibold">
          {row?.number_of_equipments}
        </p>
      </div>
    </div>
  );
}
