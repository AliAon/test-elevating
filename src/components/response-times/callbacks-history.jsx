import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { ChevronRight, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetCallbacksHistoryQuery } from "@/redux/services/call-backs-api";
import dayjs from "dayjs";
import Paginate from "@/components/common/paginate";
import { useDebounce } from "@/hooks/useDebounce";
import CallbacksFilterPopup from "@/pages/callbacks/callbacks-filter-popup";

export default function ResponseHistory({
  subscription_id,
  from_date,
  to_date,
  buildingId,
  data: monthly_data,
  selectedMonth,
}) {
  const PAGE_SIZE = 30;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debounce = useDebounce(search, 300);
  const [sortkey, setSortkey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"
  const [filters, setFilters] = useState({});

  const { data, isLoading } = useGetCallbacksHistoryQuery(
    {
      es_subscription_id: subscription_id,
      buildingId: buildingId?.level3_id,
      search_property: debounce || filters.property,
      status: filters.status,
      equipment_id: filters.equipment_id,
      date_from: filters.date_from,
      date_to: filters.date_to,
    },
    { skip: !subscription_id },
  );

  const final_data = selectedMonth ? monthly_data : data?.data?.results;
  const totalPages = Math.max(
    1,
    Math.ceil((final_data?.length || 0) / PAGE_SIZE),
  );
  const paginatedData = final_data?.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, monthly_data, data]);
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-2xl text-black font-semibold">Recent Incident</p>
          {buildingId && (
            <p className="bg-[#EAECEF] rounded-full text-xs text-text_secondary font-medium px-2 py-1 w-fit text-center">
              {buildingId.level3_name}
            </p>
          )}
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
              placeholder={`Try searching "property"`}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            />
          </div>
          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <CallbacksFilterPopup filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-5">
        <TableHeader onSetSortkey={setSortkey} onSetSortOrder={setSortOrder} />
        <div className="mt-2 min-w-[1100px] space-y-2">
          {isLoading ? (
            <SkeletonRows />
          ) : final_data?.length === 0 ? (
            <p className="text-sm text-text_secondary font-bold text-center mt-10">
              No item found
            </p>
          ) : (
            [...(paginatedData || [])]
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
              ?.map((row) => <TableRow key={row?.id} item={row} />)
          )}
        </div>
        {!isLoading && final_data?.length > 0 && (
          <Paginate
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

function TableHeader({ onSetSortkey, onSetSortOrder }) {
  return (
    <div className="min-w-[1100px] h-12 flex items-center justify-between bg-gray-50 rounded-lg px-4 border border-gray-200">
      <div className="w-[180px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Equipment
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("equipment_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[140px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Date
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("stopped_date");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[220px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Issue
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("problem");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[180px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Provider
        <ChevronsUpDown size={16} className="cursor-pointer" />
      </div>
      <div className="w-[180px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Response Time
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("arrivalDate");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[140px] flex items-center gap-2 text-xs text-text_secondary font-semibold">
        Status
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("jobStatus");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[20px] flex items-center gap-2 text-xs text-text_secondary font-semibold"></div>
    </div>
  );
}

function TableRow({ item }) {
  const {
    id,
    property_name,
    equipment_name,
    stopped_date,
    problem,
    solve_date,
    jobStatus,
    detailed_info
  } = item || {};
  // Calculate response time for Schindler (arrivalDateTime - jobDate)
  let responseTime = null;
  let arrivalDate = null;
  // if (item?.detailed_info?.service_provider_brand === "Schindler") {
    const jobDate = item?.stopped_date
      ? item.stopped_date
      : item?.detailed_info?.callback_data?.jobDate
        ? item.detailed_info.callback_data.jobDate
      : item?.detailed_info?.job_date
        ? item.detailed_info.job_date
        : null;
    arrivalDate = item?.detailed_info?.callback_data?.callback?.arrivalDateTime
      ? item.detailed_info.callback_data.callback.arrivalDateTime
      : item.arrival_date
      ? item.arrival_date
      : item?.solve_date
        ? item.solve_date
        : null;
    if (jobDate && arrivalDate) {
      const start = dayjs(jobDate);
      const end = dayjs(arrivalDate);
      const diff = end.diff(start, "minute");
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      responseTime = `${hours}h ${minutes}m`;
    }
  // }
  return (
    <Link
      to={`/response-time-callbacks-overview/${id}`}
      className="w-full flex items-center justify-between bg-white rounded-lg p-4 transition-colors duration-200 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-sm cursor-pointer group"
      tabIndex={0}
      aria-label={`View details for ${equipment_name || "incident"}`}
    >
      {/* Equipment + property */}
      <div className="w-[180px] space-y-1">
        <p className="text-sm font-semibold text-text_secondary group-hover:text-primary">
          {equipment_name || "N/A"}
        </p>
        <p className="text-xs text-text_secondary">{property_name || "N/A"}</p>
      </div>
      {/* Date */}
      <div className="w-[140px] space-y-1">
        <p className="text-sm text-text_primary font-semibold group-hover:text-primary">
          {stopped_date 
            ? dayjs(stopped_date).format("DD MMM YYYY, HH:mm")
            : jobDate 
            ? dayjs(jobDate).format("DD MMM YYYY, HH:mm") : "N/A"}
        </p>
      </div>

      {/* Issue */}
      <div className="w-[220px] space-y-1">
        <p className="text-xs text-text_secondary font-semibold">
          {problem ?? "Nothing identified"}
        </p>
      </div>

      {/* Provider */}
      <div className="w-[180px] space-y-1">
        <p className="text-sm text-text_secondary font-semibold">
          {item?.detailed_info?.service_provider_brand || "N/A"}
        </p>
      </div>

      {/* Response Time (Schindler only) */}
      <div className="w-[180px] space-y-1">
        {item?.detailed_info?.service_provider_brand === "Schindler" ? (
          <>
            <p className="text-sm text-text_secondary font-semibold">
              {responseTime ?? "Not available"}
            </p>
            <p className="text-xs text-text_secondary">
              {arrivalDate
                ? dayjs(arrivalDate).format("DD MMM YYYY, HH:mm")
                : ""}
            </p>
          </>
        ) : (
          <p className="text-xs text-text_secondary italic">-</p>
        )}
      </div>

      {/* Status + subtext */}
      <div className="w-[140px] space-y-1 flex flex-col items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              (jobStatus ?? "Open").toLowerCase() === "open"
                ? "bg-[#FF3B30]"
                : "bg-[#1F98B2]"
            }`}
          />
          <p className="text-sm text-text_secondary font-semibold">
            {jobStatus ?? "Open"}
          </p>
        </div>
        <p className="text-xs text-text_secondary mt-1">
          {item?.detailed_info?.updated_date
            ? dayjs(item.detailed_info.updated_date).format("DD MMM YYYY")
            : ""}
        </p>
      </div>
      <ChevronRight
        size={20}
        color="#898EA6"
        className="opacity-70 group-hover:opacity-100"
      />
    </Link>
  );
}

function SkeletonRows() {
  const rows = Array.from({ length: 10 });

  return (
    <>
      {rows.map((_, index) => (
        <div
          key={index}
          className="w-full flex items-center justify-between bg-white rounded-2xl animate-pulse"
        >
          <div className="w-[192px] p-4">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>

          <div className="w-[192px] p-4">
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
          </div>

          <div className="w-[150px] p-4">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>

          <div className="w-[200px] p-4">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>

          <div className="w-[150px] p-4">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>

          <div className="w-[146px] p-4 flex justify-between">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
}
