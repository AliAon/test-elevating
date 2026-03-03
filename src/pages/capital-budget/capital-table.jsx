import React, { useEffect, useState } from "react";
import { ChevronRight, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAccessibleEquipmentsQuery } from "@/redux/services/equipments-api";
import { useDebounce } from "@/hooks/useDebounce";
import Paginate from "@/components/common/paginate";
import { capitalTabs } from "@/helpers/constant";
import CapitalBudgetFilterPopup from "./capital-filter-popup";

const formatCurrency = (value) => {
  if (!value || value === "-") return "-";
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export default function CapitalTable({
  es_subscription_id,
  level1,
  level2,
  level3,
  service_contract,
  equiment_type,
}) {
  const [active, setActive] = useState(capitalTabs[0].key);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [sortkey, setSortkey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  const currentPage = searchParams.get("page") ?? page;
  const handleClick = (key) => {
    setActive(key);
  };

  const debounce = useDebounce(search, 300);
  const params = {
    page: currentPage,
    limit: 30,
    equipment_type: active,
    service_contract: service_contract,
    level1: level1?.level1_id,
    level2: level2?.level2_id,
    level3: level3,
  };
  if (active === "all") params.equipment_type = "all";
  const { data, isLoading, isFetching } = useGetAccessibleEquipmentsQuery(
    {
      ...params,
      es_subscription_id,
      search_property: debounce || filters.property,
      equipment_id: filters.equipment_id,
      year: filters.year,
    },
    {
      skip: !es_subscription_id,
    },
  );

  useEffect(() => {
    setActive(equiment_type);
  }, [equiment_type]);

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <div className="w-fit h-13 flex items-center rounded-2xl bg-white p-1">
          {capitalTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleClick(tab.key)}
              className={`h-full text-sm font-medium cursor-pointer rounded-2xl transition-colors px-5 ${
                active === tab.key
                  ? "bg-bg_primary text-text_primary"
                  : "text-text_secondary"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
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
              placeholder={`Search equipment`}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            />
          </div>
          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <CapitalBudgetFilterPopup
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-8">
        {!es_subscription_id ? (
          <p className="text-sm text-text_secondary font-bold text-center mt-10">
            Please select an ES Subscription
          </p>
        ) : (
          <>
            <TableHeader
              onSetSortkey={setSortkey}
              onSetSortOrder={setSortOrder}
            />
            <div className="mt-2 min-w-[1100px] space-y-2">
              {isLoading || isFetching ? (
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : Array.isArray(data?.data?.equipments) &&
                data.data.equipments.length === 0 ? (
                <p className="text-sm text-text_secondary font-bold text-center mt-10">
                  No equipment found
                </p>
              ) : Array.isArray(data?.data?.equipments) ? (
                [...(data.data.equipments || [])]
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
                  .map((item, index) => <TableRow key={index} item={item} />)
              ) : (
                <p className="text-sm text-red-500 font-bold text-center mt-10">
                  Unexpected data format
                </p>
              )}
            </div>

            {Array.isArray(data?.data?.equipments) &&
              data?.data?.equipments.length > 0 && (
                <div>
                  <Paginate
                    totalPages={data?.data?.total_pages}
                    currentPage={page}
                    onPageChange={setPage}
                  />
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}

function TableHeader({ onSetSortkey, onSetSortOrder }) {
  return (
    <div className="min-w-[1150px] flex items-center justify-between mb-3 px-2 border-1 border-gray-200 py-2 rounded-md">
      <div className="w-[220px] flex items-center gap-2 text-xs text-text_secondary/70 font-semibold uppercase tracking-wider px-4">
        Name
        <ChevronsUpDown
          size={14}
          className="opacity-50  cursor-pointer"
          onClick={() => {
            onSetSortkey("equipment_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[220px] flex items-center gap-2 text-xs text-text_secondary/70 font-semibold uppercase tracking-wider px-4">
        Design
        <ChevronsUpDown
          size={14}
          className="opacity-50 cursor-pointer"
          onClick={() => {
            onSetSortkey("design_code");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[180px] flex items-center gap-2 text-xs text-text_secondary/70 font-semibold uppercase tracking-wider px-4">
        Installation
        <ChevronsUpDown
          size={14}
          className="opacity-50 cursor-pointer"
          onClick={() => {
            onSetSortkey("year_of_installation");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[220px] flex items-center gap-2 text-xs text-text_secondary/70 font-semibold uppercase tracking-wider px-4">
        Modernization
        <ChevronsUpDown
          size={14}
          className="opacity-50 cursor-pointer"
          onClick={() => {
            onSetSortkey("last_modernization_parts");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[250px] flex items-center gap-2 text-xs text-text_secondary/70 font-semibold uppercase tracking-wider px-4">
        Budget
        <ChevronsUpDown
          size={14}
          className="opacity-50 cursor-pointer"
          onClick={() => {
            onSetSortkey("property_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[60px] flex items-center justify-end px-4"></div>
    </div>
  );
}

function TableRow({ item }) {
  return (
    <Link
      to={`/capital-budget/${item?.equipment_id}`}
      className="group w-full flex items-center justify-between bg-white rounded-md hover:shadow-xs transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/10 overflow-hidden"
    >
      {/* Name Column */}
      <div className="w-[220px] p-4 space-y-1.5">
        <p
          className="text-sm text-text_primary font-bold line-clamp-1 group-hover:text-primary transition-colors"
          title={item?.equipment_name}
        >
          {item?.equipment_name || "-"}
        </p>
        <p className="text-xs text-text_secondary/70 font-medium">
          {item?.oem_service_equipment_number || "-"}
        </p>
      </div>

      {/* Design Column */}
      <div className="w-[220px] p-4 space-y-1.5">
        <p className="text-sm text-text_primary font-semibold line-clamp-1">
          {item?.design_code || "-"}
        </p>
        <p className="text-xs text-text_secondary/70">
          {item?.brand_name || "-"}{" "}
          <span className="text-text_secondary/40">•</span>{" "}
          {item?.model_number || "-"}
        </p>
      </div>

      {/* Installation Column */}
      <div className="w-[180px] p-4 space-y-1.5">
        <p className="text-sm text-text_primary font-semibold">
          {item?.year_of_installation || "-"}{" "}
          <small>
            (
            {item?.year_of_installation
              ? new Date().getFullYear() - item.year_of_installation
              : "-"}{" "}
            yrs old)
          </small>
        </p>
        <p className="text-xs text-text_secondary/70">
          <span className="font-medium">Design Life:</span>{" "}
          {item?.equipment_life || "-"} yrs
        </p>
      </div>

      {/* Modernization Column */}
      <div className="w-[220px] p-4 space-y-1.5">
        <p
          className="text-sm text-text_primary font-semibold line-clamp-1"
          title={item?.last_modernization_parts}
        >
          {item?.last_modernization_parts || "-"}
        </p>
        <p className="text-xs text-text_secondary/70">
          {item?.last_modernization_date
            ? new Date(item.last_modernization_date).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
              )
            : "-"}
        </p>
      </div>

      {/* Budget Column */}
      <div className="w-[250px] p-4 space-y-1.5">
        <p className="text-sm text-text_primary font-bold">
          {formatCurrency(item?.capital_budget?.min_price)} -{" "}
          {formatCurrency(item?.capital_budget?.max_price)}
        </p>
        <p className="text-xs text-text_secondary/70">
          <span className="font-medium">Replace by:</span>{" "}
          {item?.capital_budget?.recomended_replacement_year || "-"}
        </p>
      </div>

      <div className="w-[60px] flex items-center justify-end px-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
          <ChevronRight
            size={16}
            className="text-text_secondary group-hover:text-primary transition-colors"
          />
        </div>
      </div>
    </Link>
  );
}

function TableRowSkeleton() {
  return (
    <div className="w-full flex items-center justify-between bg-white rounded-2xl border border-gray-100">
      <div className="w-[220px] p-4 space-y-2">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-3 w-24 rounded-md" />
      </div>

      <div className="w-[220px] p-4 space-y-2">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-3 w-32 rounded-md" />
      </div>

      <div className="w-[180px] p-4 space-y-2">
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-3 w-20 rounded-md" />
      </div>

      <div className="w-[220px] p-4 space-y-2">
        <Skeleton className="h-4 w-36 rounded-md" />
        <Skeleton className="h-3 w-24 rounded-md" />
      </div>

      <div className="w-[250px] p-4 space-y-2">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-3 w-28 rounded-md" />
      </div>

      <div className="w-[60px] p-4 flex justify-end">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}
