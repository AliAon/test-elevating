import CallbacksList from "@/components/callbacks/callbacksList";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetCallbacksHistoryByIdQuery } from "@/redux/services/call-backs-api";
import { useGetEquipmentByIdQuery } from "@/redux/services/groups";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PlannedCallbacks() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { subscription_id } = useSelector((state) => state.subscription_id);
  const equipment_id = searchParams.get("equipment_id");
  const [search, setSearch] = useState("");
  const debounce = useDebounce(search, 300);
  const [filters, setFilters] = useState({});

  const { data, isLoading } = useGetCallbacksHistoryByIdQuery(
    {
      id: subscription_id,
      equipment_id,
      search_property: debounce || filters.property,
      date_from: filters.date_from,
      date_to: filters.date_to,
      status: filters.status,
    },
    {
      skip: !subscription_id || !equipment_id,
    },
  );

  const { data: equipmentData } = useGetEquipmentByIdQuery(
    equipment_id,

    {
      skip: !equipment_id,
    },
  );

  const statistics_list = [
    {
      icon: "/assets/svg/maint-8.svg",
      icon_bg: "#C2285A26",
      title: "Callbacks",
      value: data?.data?.count,
      extra_label: "",
      des: "in last 12 months",
    },
    {
      icon: "/assets/svg/maint-5.svg",
      icon_bg: "#B468B926",
      title: "Trapped Passengers",
      value: data?.data?.trapped_count,
      extra_label: "",
      des: "in last 12 months",
    },
    {
      icon: "/assets/svg/maint-9.svg",
      icon_bg: "#1F98B226",
      title: "Availability",
      value: data?.data?.closed_percentage + "%",
      extra_label: "",
      des: "in last 12 months",
    },
  ];
  return (
    <div>
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-text_primary font-semibold">
                {equipmentData?.data?.equipment_name}
              </p>
              <p className="text-sm text-text_secondary font-medium mt-1">
                {equipmentData?.data?.es_pulse_equipment_number}
                {equipmentData?.data?.equipment_type &&
                  ` (${equipmentData?.data?.equipment_type})`}
              </p>
            </div>
            <Button
              onClick={() =>
                navigate(`/planned-equipment-details/${equipment_id}`)
              }
              className="w-[200px] h-11 rounded-full text-sm font-semibold"
            >
              Equipment Details
              <ChevronRight />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            {statistics_list.map((item, index) => (
              <StatisticsCard key={index} item={item} />
            ))}
          </div>
        </>
      )}

      <CallbacksList
        data={data?.data?.results}
        isLoading={isLoading}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}

const StatisticsCard = ({ item }) => {
  return (
    <div className="flex items-center gap-3 bg-bg_primary rounded-xl px-4 py-6">
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full"
        style={{
          background: item.icon_bg,
        }}
      >
        <img src={item.icon} alt="" width={24} height={24} />
      </div>

      <div className="space-y-0.5">
        <p className="text-sm text-text_primary font-medium">{item.title}</p>
        <div className="flex items-center gap-1">
          <p className="text-3xl text-text_primary font-semibold">
            {item.value}
          </p>
          {item.extra_label && (
            <>
              <p className="text-2xl text-[#898EA6] font-semibold">/</p>
              <p className="text-2xl text-[#C2285A] font-semibold">
                {item.extra_label}
              </p>
            </>
          )}
        </div>
        {item.des && (
          <p className="text-xs text-text_secondary font-medium">{item.des}</p>
        )}
      </div>
    </div>
  );
};

const CardSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="flex items-center gap-3 bg-[#F6F6F8] rounded-xl px-4 py-6 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center" />

          <div className="flex flex-col gap-2 w-full">
            <div className="w-24 h-3 bg-gray-200 rounded" />

            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-6 bg-gray-200 rounded" />
            </div>

            <div className="w-32 h-3 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#F6F6F8] rounded-xl px-4 py-6 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center" />

          <div className="flex flex-col gap-2 w-full">
            <div className="w-24 h-3 bg-gray-200 rounded" />

            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-6 bg-gray-200 rounded" />
            </div>

            <div className="w-32 h-3 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#F6F6F8] rounded-xl px-4 py-6 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center" />

          <div className="flex flex-col gap-2 w-full">
            <div className="w-24 h-3 bg-gray-200 rounded" />

            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-6 bg-gray-200 rounded" />
              <div className="w-8 h-6 bg-gray-200 rounded" />
            </div>

            <div className="w-32 h-3 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
