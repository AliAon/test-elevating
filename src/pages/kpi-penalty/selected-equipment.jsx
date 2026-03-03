import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  ChevronRight,
  ChevronsUpDown,
  Loader,
  SlidersHorizontal,
} from "lucide-react";
import dayjs from "dayjs";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount || 0);
};
import { StatisticsCard } from "../maintenance";
import KPIPanaltySelectedMonth from "@/components/kpi-penalty/selected-month";
import SelectedBuildingKpiPanaltyForecast from "@/components/kpi-penalty/selected-building-kpi-panalty-forecast";
import { Input } from "@/components/ui/input";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useGetKpiPenaltySelectedEquipmentStatsQuery } from "@/redux/services/dashboard-api";
import { useSelector } from "react-redux";
import Paginate from "@/components/common/paginate";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { useGetAllServiceContractsQuery } from "@/redux/services/service-contracts";
const statistics_list = [
  {
    icon: "/assets/svg/penalty.svg",
    icon_bg: "#248EA526",
    title: "Total Penalty",
    value: "$84.5k",
    extra_label: "",
    des: "In last 12 months",
  },
  {
    icon: "/assets/svg/kpi-failed.svg",
    icon_bg: "#C2285A26",
    title: "KPI Failed",
    value: "20",
    extra_label: "",
    des: "In last 12 months",
  },
  {
    icon: "/assets/svg/downtime.svg",
    icon_bg: "#1F98B226",
    title: "Total Downtime",
    value: "332 h",
    extra_label: "",
    des: "In last 12 months",
  },
];

export default function KPIPenalitySelected() {
  const [date] = useState(undefined);
  const [toDate] = useState(undefined);
  const [selectedState] = useState(""); // State for selected value
  const navigate = useNavigate();
  const { subscription_id } = useSelector((state) => state.subscription_id);
  const equipmentId = useParams().id;
  const [searchParams] = useSearchParams();
  const buildingId = searchParams.get("building_id");
  const [page, setPage] = useState(1);

  const { data: equipmentData, isLoading } =
    useGetKpiPenaltySelectedEquipmentStatsQuery(
      {
        es_subscription_id: subscription_id,
        level3: buildingId,
        equipment_id: equipmentId,
        page: page,
      },
      {
        skip: !equipmentId || !buildingId || !subscription_id,
      },
    );
  const equipment_stats = equipmentData?.data?.equipment_stats;
  const equipment_pagination = equipment_stats?.[0]?.pagination;
  const statistics_list_buildings = [
    {
      icon: "/assets/svg/penalty.svg",
      icon_bg: "#8CAA0026",
      title: "Total Penalty",
      value: `$ ${equipment_stats?.[0]?.total_penalty ?? 0}`,
      extra_label: "",
      des: "In last 12 months",
    },
    {
      icon: "/assets/svg/kpi-failed.svg",
      icon_bg: "#C2285A26",
      title: "KPI Failed",
      value: equipment_stats?.[0]?.total_failed_kpi ?? 0,
      extra_label: "",
      des: "In last 12 months",
    },
    {
      icon: "/assets/svg/downtime.svg",
      icon_bg: "#1F98B226",
      title: "Total Downtime",
      value: `${equipment_stats?.[0]?.total_downtime_hours.toFixed(2) ?? 0} h`,
      extra_label: "",
      des: "In last 12 months",
    },
    {
      icon: "/assets/svg/call-back.svg",
      icon_bg: "#FFDED0",
      title: "Callbacks",
      value: `${equipment_stats?.[0]?.total_callbacks ?? 0}`,
      extra_label: "",
      des: "In last 12 months",
    },
    {
      icon: "/assets/svg/passenger-traped.svg",
      icon_bg: "#B468B926",
      title: "Passenger Trapped Events",
      value: `${equipment_stats?.[0]?.total_trapped_events ?? 0}`,
      extra_label: "",
      des: "In last 12 months",
    },
    {
      icon: "/assets/svg/maintaince.svg",
      icon_bg: "#1F98B226",
      title: "Maintenance",
      value: `${equipment_stats?.[0]?.total_maintenance ?? 0}`,
      extra_label: "",
      des: "In last 12 months",
    },
  ];
  const showMaintenanceSelected = date && toDate;

  if (isLoading) {
    return <SelectedEquipmentSkeleton />;
  }
  const list = [
    {
      item: "Kpi Penalty",
      link: "/kpi-penalty",
    },
    {
      item: "Kpi Penalty Details",
      link: "#",
    },
  ];

  return (
    <div>
      <Breadcrumbs list={list} />
      <div className="flex items-center justify-between mt-7">
        <div className="flex flex-col gap-1">
          <p className="text-4xl text-text_primary font-semibold">
            {equipment_stats?.[0]?.equipment_name}
          </p>
          <p className="text-sm text-text_secondary font-medium mt-1">
            {equipment_stats?.[0]?.equipment_number}
          </p>
        </div>
        <Button
          onClick={() => navigate(`/equipment-details/${equipmentId}`)}
          className="w-fit h-11 rounded-full text-sm font-semibold"
        >
          View Details
          <ChevronRight />
        </Button>
      </div>
      {
        <div className="grid grid-cols-6 gap-3 mt-5">
          {statistics_list_buildings?.map((item, index) => (
            <StatisticsCard key={index} item={item} />
          ))}
        </div>
      }
      {!selectedState && showMaintenanceSelected && (
        <div className="grid grid-cols-3 gap-3 mt-5">
          {statistics_list?.map((item, index) => (
            <StatisticsCard key={index} item={item} />
          ))}
        </div>
      )}
      <div className="flex xl:flex-row flex-col gap-5 mt-5">
        {showMaintenanceSelected && <KPIPanaltySelectedMonth />}
        {selectedState && <SelectedBuildingKpiPanaltyForecast />}
      </div>{" "}
      <RecentKpiPenaltiesTable
        isLoading={isLoading}
        all_kpis={equipment_stats?.[0]?.all_kpis}
        equipment_pagination={equipment_pagination}
        setPage={setPage}
        page={page}
      />
    </div>
  );
}

function RecentKpiPenaltiesTable({
  all_kpis,
  isLoading,
  equipment_pagination,
  setPage,
  page,
}) {
  const es_subscription_id = useSelector(
    (state) => state.subscription_id.subscription_id,
  );
  const { data: all_service_contracts } = useGetAllServiceContractsQuery(
    {
      es_subscription_id: es_subscription_id,
    },
    {
      skip: !es_subscription_id,
    },
  );
  const serviceContractsData = all_service_contracts?.data?.contracts;
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-black font-semibold">
          Recent KPI Penalties
        </p>
        <div className="flex items-center gap-4">
          <div className="relative w-[297px] h-11 bg-gradient-to-r from-[#FFCBB6] to-primary/0 rounded-2xl p-[1px]">
            <img
              src="/assets/svg/search.svg"
              alt=""
              width={24}
              height={24}
              className="absolute top-1/2 -translate-y-1/2 left-5"
            />
            <Input
              placeholder={`Try searching "property"`}
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            />
          </div>
          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <SlidersHorizontal size={20} className="text-text_secondary" />
            <p className="text-sm text-text_secondary font-semibold">Filter</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar w-full mt-5">
        <TableHeader />
        {isLoading ? (
          <SkeletonRows />
        ) : (
          <div className="mt-2 min-w-[950px] space-y-2">
            {all_kpis?.map((row, idx) => (
              <TableRow
                key={idx}
                item={row}
                serviceContractsData={serviceContractsData}
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <Paginate
          totalPages={equipment_pagination?.total_pages}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="mt-2 min-w-[950px] space-y-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="h-16 bg-white rounded-lg border border-gray-200 animate-pulse"
        />
      ))}
    </div>
  );
}
const tableGrid = "grid grid-cols-[1fr_1fr_1fr_1fr_1fr_112px]";
function TableHeader() {
  return (
    <div
      className={`${tableGrid} min-w-[950px] h-12 bg-gray-50 rounded-lg border border-gray-200 items-center`}
    >
      {[
        "Equipment",
        "Penalty",
        "Reason",
        "Service Contract",
        "Downtime",
        "Trapped Event",
      ].map((label) => (
        <div
          key={label}
          className="flex items-center gap-2 text-xs text-text_secondary font-semibold px-4"
        >
          {label}
          <ChevronsUpDown size={14} />
        </div>
      ))}
    </div>
  );
}

function TableRow({ item, serviceContractsData }) {
  const serviceContractName = serviceContractsData?.find(
    (c) => c?.id === item?.service_contract_id,
  )?.contract_name;

  return (
    <Link
      to={`/kpi-panailty-selected-equipment/${item.equipment_id}?building_id=${item.building_id}`}
    >
      <div
        className={`${tableGrid} group min-w-[950px] h-16 bg-white rounded-lg border border-gray-200 items-center no-scrollbar hover:shadow-sm transition-shadow cursor-pointer`}
      >
        {/* Equipment */}
        <div className="flex flex-col gap-1 px-4 py-3">
          <p className="text-sm font-semibold">{item?.equipment_number}</p>
          <p className="text-xs text-text_secondary">
            {item?.brand_name}
            {item?.building_name && ` • ${item?.building_name}`}
          </p>
        </div>

        {/* Penalty */}
        <div className="flex flex-col gap-1 px-4 py-3">
          <p className="text-sm font-semibold">
            {formatCurrency(item?.kpi_rebate_amount)}
          </p>
          <p className="text-xs text-text_secondary">
            {item?.service_provider}
          </p>
        </div>

        {/* Reason */}
        <div className="px-4 py-3 text-xs text-text_secondary truncate">
          {item?.reason ?? "-"}
        </div>

        {/* Service Contract */}
        <div className="px-4 py-3 text-xs text-text_secondary truncate">
          {serviceContractName ?? "-"}
        </div>

        {/* Downtime */}
        <div className="flex flex-col gap-1 px-4 py-3">
          <p className="text-sm font-semibold">
            {item?.down_time_hours?.toFixed(1)} hours
          </p>
          <p className="text-xs text-text_secondary">
            {dayjs(item?.createdAt).format("DD MMM YYYY")}
          </p>
        </div>

        {/* Trapped Event */}
        <div className="flex items-center justify-between px-4 py-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              item?.trapped_events > 0
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {item?.trapped_events > 0 ? "Yes" : "No"}
          </span>
          <ChevronRight
            size={20}
            className="opacity-0 group-hover:opacity-100 transition"
          />
        </div>
      </div>
    </Link>
  );
}

function SelectedEquipmentSkeleton() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mt-7">
        <div className="flex flex-col gap-3 flex-1">
          <div className="h-10 bg-gray-200 rounded-lg w-96 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded-lg w-80 animate-pulse" />
        </div>
        <div className="h-11 w-32 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
      </div>

      {/* Statistics Cards Grid Skeleton */}
      <div className="grid grid-cols-6 gap-3 mt-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-lg p-5 space-y-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-8 bg-gray-200 rounded w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Table Skeleton */}
      <div className="flex xl:flex-row flex-col gap-5 mt-5">
        {/* Chart Skeleton */}
        <div className="flex-1 bg-bg_primary rounded-xl p-6">
          <div className="h-6 bg-gray-200 rounded-lg w-48 mb-6 animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Recent KPI Penalties Table Skeleton */}
      <div className="bg-bg_primary rounded-xl p-6 mt-5">
        <div className="flex items-center justify-between mb-5">
          <div className="h-7 bg-gray-200 rounded-lg w-48 animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-11 bg-gray-200 rounded-2xl w-72 animate-pulse" />
            <div className="h-11 bg-gray-200 rounded-2xl w-28 animate-pulse" />
          </div>
        </div>

        {/* Table Header Skeleton */}
        <div className="min-w-[950px] h-12 bg-gray-100 rounded-lg border border-gray-200 animate-pulse mb-2" />

        {/* Table Rows Skeleton */}
        <div className="mt-2 min-w-[950px] space-y-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-16 bg-white rounded-lg border border-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
