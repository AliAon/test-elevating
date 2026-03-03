import React, { useState } from "react";
import { Input } from "../ui/input";
import {
  ChevronRight,
  ChevronsUpDown,
  Loader,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useGetLvl3ListQuery } from "@/redux/services/subscription";
import { useGetAllServiceContractsQuery } from "@/redux/services/service-contracts";
import { useSelector } from "react-redux";
import CapitalBudgetFilterPopup from "@/pages/capital-budget/capital-filter-popup";
import CallbacksFilterPopup from "@/pages/callbacks/callbacks-filter-popup";
import KpiPentaltyFilterPopup from "@/pages/kpi-penalty/kpi-penalty-filter-popup";
import { useDebounce } from "@/hooks/useDebounce";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount || 0);
};

export default function RecentKpiPenalties({
  buildingData,
  kpiDataLoading,
  filters,
  setFilters,
  search,
  setSearch,
}) {
  const all_kpis_selected_12month = buildingData || [];
  const es_subscription_id = useSelector(
    (state) => state.subscription_id.subscription_id,
  );
  const [sortkey, setSortkey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  const { data: buildings } = useGetLvl3ListQuery({ limit: 100 });
  const allBuildingData = buildings?.data;
  const { data: serviceContracts } = useGetAllServiceContractsQuery({
    es_subscription_id,
  });
  const serviceContractsData = serviceContracts?.data?.contracts;

  return (
    <div className="bg-bg_primary rounded-lg p-6 mt-5">
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            />
          </div>
          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <KpiPentaltyFilterPopup filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-5">
        <TableHeader onsetSortkey={setSortkey} onsetSortOrder={setSortOrder} />
        {kpiDataLoading ? (
          <div className="mt-2 min-w-[900px] space-y-2">
            <SkeletonRows />
          </div>
        ) : (
          <div className="mt-2 min-w-[900px] space-y-2">
            {[...(all_kpis_selected_12month || [])]
              ?.sort((a, b) => {
                const valA = a[sortkey];
                const valB = b[sortkey];
                //if date
                if (!isNaN(Date.parse(valA)) && !isNaN(Date.parse(valB))) {
                  return sortOrder === "asc"
                    ? new Date(valA) - new Date(valB)
                    : new Date(valB) - new Date(valA);
                }
                //if number
                if (typeof valA === "number" && typeof valB === "number") {
                  return sortOrder === "asc" ? valA - valB : valB - valA;
                }

                //if String
                return sortOrder === "asc"
                  ? valA?.toString()?.localeCompare(valB?.toString())
                  : valB?.toString()?.localeCompare(valA?.toString());
              })
              ?.map((row, idx) => (
                <TableRow
                  key={row?.equipment_id ?? idx}
                  row={row}
                  allBuildingData={allBuildingData}
                  serviceContractsData={serviceContractsData}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TableHeader({ onsetSortkey, onsetSortOrder }) {
  return (
    <div className="min-w-[950px] h-12 flex items-center justify-between bg-gray-50 rounded-lg px-4 border border-gray-200">
      <div className="w-[280px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Building
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onsetSortkey("name");
            onsetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[280px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        KPI Type
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onsetSortkey("kpi_type");
            onsetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[280px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Reason
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onsetSortkey("reason");
            onsetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[280px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Service Contract
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onsetSortkey("serviceContractName");
            onsetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[140px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Penalty
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onsetSortkey("kpi_rebate_amount");
            onsetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[160px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Downtime
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onsetSortkey("down_time_hours");
            onsetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[160px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Trapped Event
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onsetSortkey("equipment_name");
            onsetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
    </div>
  );
}

function TableRow({ row, allBuildingData, serviceContractsData }) {
  const buildingName = allBuildingData?.find(
    (item) => item.id == row?.building_id,
  );
  const trappedCount = row?.trapped_events ?? 0;
  const hasTrappedEvent = trappedCount > 0;
  const serviceContractName = serviceContractsData?.find(
    (item) => item.contract_id == row.service_contract_id,
  )?.contract_name;

  return (
    <Link
      to={`/kpi-panailty-selected-equipment/${row?.equipment_id}?building_id=${row?.building_id}`}
      className="w-full flex items-center justify-between bg-white rounded-lg p-4 transition-colors duration-200 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm cursor-pointer group"
      aria-label={`Open KPI penalties for 
        `}
    >
      {/* Equipment: Name */}
      <div className="w-[280px] space-y-1">
        <p className="text-xs text-text_secondary">{buildingName?.name}</p>
        <p className="text-xs text-text_secondary">
          {"Equip No: " + " # " + (row?.equipment_number ?? "-")}
        </p>
      </div>
      {/* Equipment: Name | Brand, building below */}
      <div className="w-[280px] space-y-1">
        <p className="text-xs text-text_secondary">{row?.kpi_type ?? "-"}</p>
      </div>
      {/* Equipment: Name | Brand, building below */}
      <div className="w-[280px] space-y-1">
        <p className="text-xs text-text_secondary line-clamp-1">
          {row?.reason ?? "-"}
        </p>
      </div>
      {/* Equipment: Name | Brand, building below */}
      <div className="w-[280px] space-y-1">
        <p className="text-xs text-text_secondary max-w-[200px] truncate line-clamp-1">
          {serviceContractName ?? "-"}
        </p>
      </div>

      {/* Penalty with service_provider below */}
      <div className="w-[140px] flex items-center space-y-1">
        <p className="text-sm text-text_secondary font-semibold">
          {formatCurrency(row?.kpi_rebate_amount)}
        </p>
        <p className="text-xs text-text_secondary">
          {row?.service_provider || "-"}
        </p>
      </div>

      {/* Downtime with createdAt below */}
      <div className="w-[160px] space-y-1">
        <p className="text-sm text-text_primary font-semibold">
          {row?.down_time_hours?.toFixed(2) || 0} hrs
        </p>
        <p className="text-xs text-text_secondary">
          {row?.createdAt ? dayjs(row?.createdAt).format("DD MMM YYYY") : "N/A"}
        </p>
      </div>

      {/* Trapped Event: colored pill */}
      <div className="w-[160px] flex items-center justify-between">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            hasTrappedEvent
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {hasTrappedEvent ? "Yes" : "No"}
        </span>
        <ChevronRight
          size={20}
          color="#898EA6"
          className="opacity-70 group-hover:opacity-100"
        />
      </div>
    </Link>
  );
}

function SkeletonRows() {
  const rows = Array.from({ length: 6 });
  return (
    <>
      {rows.map((_, i) => (
        <div
          key={i}
          className="w-full flex items-center justify-between bg-white rounded-lg p-4 animate-pulse border border-gray-100"
        >
          <div className="w-[240px]">
            <div className="h-4 w-36 bg-gray-200 rounded"></div>
          </div>
          <div className="w-[160px]">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="w-[120px]">
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>
          <div className="w-[160px]">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="w-[140px]">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="w-[120px]">
            <div className="h-4 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
}
