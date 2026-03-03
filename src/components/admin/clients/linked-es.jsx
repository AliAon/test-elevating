import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetSubscriptionsQuery } from "@/redux/services/subscription";
import {
  ChevronRight,
  ChevronsUpDown,
  CirclePlus,
  SlidersHorizontal,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import AdminSubscriptionFilterPopup from "@/pages/admin/client-es-subscription/admin-subscription-filter-popup";

export default function LinkedESClient() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const clientId = params.get("clientId");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const { data, isLoading } = useGetSubscriptionsQuery(
    {
      clientId,
      subscription_type: filters?.subscription_type,
    },
    {
      skip: !clientId,
    },
  );

  const subscriptions = data?.data || [];

  return (
    <div>
      <div className="bg-bg_primary rounded-xl p-6 mt-5">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-text_primary font-semibold">
            ES Subscriptions
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
                placeholder="Search subscriptions"
                className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
              <AdminSubscriptionFilterPopup
                filters={filters}
                setFilters={setFilters}
                isClient={false}
              />
            </div>

            <Button
              className="w-[207px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary"
              onClick={() => {
                navigate("/admin/es-contracts-add");
              }}
            >
              <CirclePlus size={18} />
              Add ES Pulse Contract
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto w-full mt-8">
          <TableHeader />
          {isLoading ? (
            <div className="mt-2 min-w-[700px] space-y-2">
              <div className="w-full h-20 bg-gray-100 animate-pulse rounded-lg"></div>
              <div className="w-full h-20 bg-gray-100 animate-pulse rounded-lg"></div>
              <div className="w-full h-20 bg-gray-100 animate-pulse rounded-lg"></div>
            </div>
          ) : subscriptions.length > 0 ? (
            <div className="mt-2 min-w-[700px] space-y-2">
              {subscriptions
                .filter((sub) =>
                  search
                    ? sub?.es_subscription_name
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                      sub?.es_subscription_number
                        ?.toLowerCase()
                        .includes(search.toLowerCase())
                    : true,
                )
                .map((row) => (
                  <TableRow key={row.subscription_id} row={row} />
                ))}
            </div>
          ) : (
            <div className="mt-8 text-center py-12">
              <p className="text-gray-500 font-medium">
                No ES Pulse Subscriptions found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TableHeader = () => {
  return (
    <div className="min-w-[700px] h-10 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-2">
      <div className="w-[250px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Subscription
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Start/End Date
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[180px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Owner
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[150px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Type
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[120px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Status
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-12"></div>
    </div>
  );
};

function TableRow({ row }) {
  const navigate = useNavigate();

  return (
    <div
      className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 group cursor-pointer"
      onClick={() =>
        navigate(`/admin/es-contracts-details/${row?.subscription_id}`)
      }
    >
      <div className="w-[250px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">
          {row?.es_subscription_name}
        </p>
        <p className="text-xs text-gray-500 font-medium">
          {row?.es_subscription_number}
        </p>
      </div>

      <div className="w-[200px] flex items-start gap-2 p-4">
        <img src="/assets/svg/connector.svg" alt="" width={14} height={40} />
        <div className="space-y-1">
          <p className="text-sm text-gray-900 font-semibold">
            {dayjs(row?.start_date).format("MMM DD, YYYY")}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            {dayjs(row?.end_date).format("MMM DD, YYYY")}
          </p>
          <p
            className={cn(
              "text-xs font-semibold",
              row?.days_remaining < 0
                ? "text-red-600"
                : row?.days_remaining < 16
                  ? "text-primary"
                  : "text-green-600",
            )}
          >
            {row?.days_remaining}D left
          </p>
        </div>
      </div>

      <div className="w-[180px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">
          {row?.subscription_owner?.contact_person || "N/A"}
        </p>
        <p className="text-xs text-gray-500 font-medium">
          {row?.subscription_owner?.phone_no || ""}
        </p>
      </div>

      <div className="w-[150px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">
          {row?.subscription_type || "Standard"}
        </p>
      </div>

      <div className="w-[120px] p-4 space-y-1 flex items-center gap-2">
        {row?.subscription_status === "active" ? (
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm" />
        ) : (
          <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm" />
        )}
        <p className="text-sm text-gray-600 font-semibold capitalize">
          {row?.subscription_status || "Inactive"}
        </p>
      </div>

      <div className="w-12 flex items-center justify-center p-4">
        <ChevronRight
          size={18}
          className="text-gray-400 group-hover:text-primary transition-colors"
        />
      </div>
    </div>
  );
}
