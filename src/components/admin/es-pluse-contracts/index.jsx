import Paginate from "@/components/common/paginate";
import NoDataFound from "@/components/no-data";
import EsPulseContractSkeleton from "@/components/skeleton/es-pulse-contract-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import AdminBuildingFilterPopup from "@/pages/admin/buildings/admin-building-filter-popup";
import AdminSubscriptionFilterPopup from "@/pages/admin/client-es-subscription/admin-subscription-filter-popup";
import { useGetSubscriptionsQuery } from "@/redux/services/subscription";
import dayjs from "dayjs";
import { CirclePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const getTypeColors = () => {
  const colorOptions = [
    { bg: "#B468B926", text: "#B468B9" },
    { bg: "#1F98B226", text: "#1F98B2" },
    { bg: "#248EA526", text: "#248EA5" },
    { bg: "#E5E5E526", text: "#666" },
  ];

  const randomIndex = Math.floor(Math.random() * colorOptions.length);
  return colorOptions[randomIndex];
};

export default function AdminESPluse() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get("page") ?? page;

  const debounce = useDebounce(search, 300);
  const [filters, setFilters] = useState({
    subscription_type: "",
    clientId: "",
  });
  const { data, isFetching } = useGetSubscriptionsQuery({
    search: debounce,
    page: currentPage,
    limit: 30,
    clientId: filters?.clientId,
    subscription_type: filters?.subscription_type,
  });

  const subscriptions = data?.data;

  useEffect(() => {
    if (currentPage) setPage(parseInt(currentPage));
    else setPage(1);
  }, []);

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-text_primary font-semibold">
          ES Pulse Subscriptions
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
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <AdminSubscriptionFilterPopup
              filters={filters}
              setFilters={setFilters}
            />
          </div>

          <Button
            onClick={() => navigate("/admin/es-contracts-add")}
            className="w-[214px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary"
          >
            <CirclePlus size={18} />
            ES Pulse Subscription
          </Button>
        </div>
      </div>
      {isFetching ? (
        <div className="grid grid-cols-3 gap-5 mt-8">
          <EsPulseContractSkeleton />
          <EsPulseContractSkeleton />
          <EsPulseContractSkeleton />
          <EsPulseContractSkeleton />
          <EsPulseContractSkeleton />
          <EsPulseContractSkeleton />
        </div>
      ) : subscriptions && subscriptions.length > 0 ? (
        <div className="grid grid-cols-3 gap-5 mt-8">
          {subscriptions.map((contract, idx) => (
            <Card
              key={contract.subscription_id}
              contract={contract}
              idx={idx}
            />
          ))}
        </div>
      ) : (
        <NoDataFound />
      )}
      <div>
        <Paginate
          totalPages={data?.pagination?.pages}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export const Card = ({ contract, idx }) => {
  const { bg, text } = getTypeColors(idx);
  const navigate = useNavigate();
  return (
    <div
      key={contract?.subscription_id}
      className="flex flex-col justify-between bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
    >
      <div className="p-5">
        {/* Badge */}
        <div
          className={cn(
            "w-fit text-[10px] uppercase tracking-wide rounded-full px-2.5 py-1 mb-4 urbanist font-semibold",
          )}
          style={{ backgroundColor: bg, color: text }}
        >
          {contract?.client_name}
        </div>

        {/* Title */}
        <h3 className="text-lg text-gray-900 font-semibold leading-tight">
          {contract?.es_subscription_name}
        </h3>

        {/* Subscription Number */}
        <p className="text-xs text-gray-500 font-medium mt-1.5">
          {contract?.es_subscription_number}
        </p>

        <div className="h-px bg-gray-100 my-4" />

        {/* Date Range */}
        <div className="flex items-center gap-2 mb-3">
          <p className="text-sm text-gray-900 font-semibold">
            {dayjs(contract.start_date).format("MMM DD, YYYY")}
          </p>
          <img
            src="/assets/svg/connect-arrow.svg"
            alt=""
            width={32}
            height={14}
          />
          <p className="text-sm text-gray-900 font-semibold">
            {dayjs(contract.end_date).format("MMM DD, YYYY")}
          </p>
        </div>
        <p
          className={cn(
            "text-xs font-semibold mb-4",
            contract.days_remaining < 0
              ? "text-red-600"
              : contract.days_remaining < 16
                ? "text-primary"
                : "text-green-600",
          )}
        >
          {contract?.days_remaining}D left
        </p>

        {/* Contact Details */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 flex items-center justify-center opacity-60">
              <img
                src="/assets/svg/user-icon.svg"
                alt=""
                width={14}
                height={14}
              />
            </div>
            <p className="text-xs text-gray-600 font-medium">
              {contract?.subscription_owner?.contact_person || "-"}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 flex items-center justify-center opacity-60">
              <img src="/assets/svg/call.svg" alt="" width={14} height={14} />
            </div>
            <p className="text-xs text-gray-600 font-medium">
              {contract?.subscription_owner?.phone_no || "-"}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 flex items-center justify-center opacity-60">
              <img src="/assets/svg/mail.svg" alt="" width={14} height={14} />
            </div>
            <p className="text-xs text-gray-600 font-medium break-all">
              {contract?.subscription_owner?.email || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="border-t border-gray-100">
        <Button
          className="bg-white hover:bg-gray-50 px-4 py-3 w-full rounded-none rounded-b-lg border-0 text-primary hover:text-primary font-semibold text-sm transition-colors"
          variant={"ghost"}
          onClick={() =>
            navigate(`/admin/es-contracts-details/${contract?.subscription_id}`)
          }
        >
          Open Details
        </Button>
      </div>
    </div>
  );
};
