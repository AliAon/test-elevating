import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { ChevronRight, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useGetCallbacksHistoryQuery } from "@/redux/services/call-backs-api";
import dayjs from "dayjs";
import Paginate from "../common/paginate";
import { useDebounce } from "@/hooks/useDebounce";
import AdminSubscriptionFilterPopup from "@/pages/admin/client-es-subscription/admin-subscription-filter-popup";
import CallbacksFilterPopup from "@/pages/callbacks/callbacks-filter-popup";

export default function CallbacksHistory({
  subscription_id,
  buildingId,
  level1,
  level2,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debounce = useDebounce(search, 300);
  const [sortkey, setSortkey] = useState("");
  const [filters, setFilters] = useState({});
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  const { data, isLoading } = useGetCallbacksHistoryQuery(
    {
      es_subscription_id: subscription_id,
      date_from: filters.date_from,
      date_to: filters.date_to,
      page: currentPage,
      limit: 10,
      level1,
      level2,
      level3: buildingId,
      search_property: debounce || filters.property,
      status: filters.status,
      equipment_id: filters.equipment_id,
    },
    { skip: !buildingId },
  );

  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  const totalPages = data?.data?.pagination?.totalPages;
  useEffect(() => {
    if (page) setCurrentPage(parseInt(page));
  }, []);

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-2xl text-black font-semibold">Callbacks History</p>
          {buildingId?.level3_name && (
            <p className="bg-[#EAECEF] rounded-full text-xs text-text_secondary font-medium px-2 py-1 w-fit text-center">
              {buildingId?.level3_name}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-[297px] h-11 bg-gradient-to-r from-[#FFCBB6] to-primary/0 rounded-lg p-[1px]">
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
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-lg bg-white border-0 ps-12"
            />
          </div>
          <div className="w-[105px]  rounded-lg bg-white flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
            <CallbacksFilterPopup filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-5">
        <TableHeader onSetSortkey={setSortkey} onSetSortOrder={setSortOrder} />
        {isLoading ? (
          <SkeletonRows />
        ) : data?.data?.results?.length === 0 ? (
          <p className="text-sm text-text_secondary font-bold text-center mt-10">
            No item found
          </p>
        ) : (
          <div className="mt-2 min-w-[900px] space-y-2">
            {[...(data?.data?.results || [])]
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
              ?.map((row) => (
                <TableRow key={row?.id} item={row} />
              ))}
          </div>
        )}
        {
          <Paginate
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        }
      </div>
    </div>
  );
}

function TableHeader({ onSetSortkey, onSetSortOrder }) {
  return (
    <div className="min-w-[900px] h-12 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
      <div className="w-[220px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4">
        Property Name
        <ChevronsUpDown
          size={14}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("property_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[220px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4">
        Equipment
        <ChevronsUpDown
          size={14}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("equipment_name");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[220px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4">
        Date & Time
        <ChevronsUpDown
          size={14}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("stopped_date");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>

      <div className="w-[220px] flex items-center gap-1 text-xs text-[#5B617F] px-3">
        JobType
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("detailed_info?.jobType");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[220px] flex items-center gap-1 text-xs text-[#5B617F] px-3">
        Stopped Date
        <ChevronsUpDown
          size={16}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("detailed_info?.stopped_date");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="flex-1 flex items-center gap-2 text-xs text-text_secondary font-semibold px-4">
        Issue
        <ChevronsUpDown
          size={14}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("problem");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[160px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4">
        Status
        <ChevronsUpDown
          size={14}
          className="cursor-pointer"
          onClick={() => {
            onSetSortkey("jobStatus");
            onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
    </div>
  );
}

function TableRow({ item }) {
  const {
    id,
    equipment_name,
    property_name,
    stopped_date,
    problem,
    solve_date,
    jobStatus,
    detailed_info,
  } = item || {};

  const getStatusStyle = (jobStatus) => {
    const statusLower = jobStatus?.toLowerCase();
    if (
      statusLower === "resolved" ||
      statusLower === "completed" ||
      statusLower === "closed"
    ) {
      return "bg-green-100 text-green-700";
    } else if (statusLower === "pending" || statusLower === "in progress") {
      return "bg-yellow-100 text-yellow-700";
    } else if (statusLower === "open" || statusLower === "new") {
      return "bg-red-100 text-red-700";
    }
    return "bg-red-100 text-red-700";
  };

  return (
    <Link
      to={`/callbacks-details/${id}`}
      className="group min-w-[900px] bg-white rounded-lg border border-gray-200 flex items-stretch hover:shadow-sm transition-shadow cursor-pointer"
    >
      {/* Date & Time Column */}
      <div className="w-[220px] flex flex-col gap-1 px-4 py-3">
        <p className="text-sm text-text_primary font-semibold">
          {property_name}
        </p>
      </div>
      {/* Equipment Column */}
      <div className="w-[220px] flex flex-col gap-0.5 px-4 py-3">
        {/* <p className="text-xs text-text_secondary">
          {detailed_info?.equipment_number || "N/A"}
        </p> */}
        <p className="text-sm text-text_primary font-semibold">
          {equipment_name || "N/A"}
        </p>
        {/* <p className="text-xs text-text_secondary">{property_name || "N/A"}</p> */}
      </div>
      {/* Date & Time Column */}
      <div className="w-[220px] flex flex-col gap-1 px-4 py-3">
        <p className="text-sm text-text_primary font-semibold">
          {dayjs(stopped_date?stopped_date:detailed_info.job_date).format("DD MMM YYYY, HH:mm")}
        </p>
        {/* <p className="text-xs text-text_secondary uppercase tracking-wide">
          {detailed_info?.unique_servie_id || "N/A"}
        </p> */}
      </div>

      {/* JobType Column */}
      <div className="w-[220px] flex flex-col gap-0.5 px-4 py-3">
        <p className="text-sm text-text_primary font-semibold capitalize">
          {detailed_info?.jobType || "N/A"}
        </p>
      </div>
      {/* Stopped Date Column */}
      <div className="w-[220px] flex flex-col gap-0.5 px-4 py-3">
        <p className="text-sm text-text_primary font-semibold capitalize">
          {dayjs(detailed_info?.stopped_date?detailed_info.stopped_date:detailed_info.job_date).format("DD MMM YYYY") || "N/A"}
        </p>
      </div>

      {/* Issue Column */}
      <div className="flex-1 flex items-center px-4 py-3">
        <p className="text-sm text-text_secondary font-medium line-clamp-2">
          {problem ?? "Nothing identified"}
        </p>
      </div>

      {/* Status Column */}
      <div className="w-[160px] flex items-center justify-between px-4 py-3">
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${getStatusStyle(
              jobStatus,
            )}`}
          >
            {jobStatus ?? "Open"}
          </span>
          <p className="text-xs text-text_secondary">
            {solve_date ? dayjs(solve_date).format("DD MMM YYYY") : "—"}
          </p>
        </div>
        <ChevronRight
          size={20}
          className="text-gray-400 group-hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        />
      </div>
    </Link>
  );
}

export function SkeletonRows() {
  return (
    <div className="mt-2 min-w-[900px] space-y-2">
      {Array.from({ length: 10 }).map((_, idx) => (
        <div
          key={idx}
          className="min-w-[900px] h-16 bg-white rounded-lg border border-gray-200 flex items-center animate-pulse"
        >
          <div className="w-[200px] flex flex-col gap-2 px-4 py-3">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>
          <div className="w-[220px] flex flex-col gap-2 px-4 py-3">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
          <div className="flex-1 px-4 py-3">
            <div className="h-4 w-full max-w-[200px] bg-gray-200 rounded" />
          </div>
          <div className="w-[160px] flex items-center justify-between px-4 py-3">
            <div className="flex flex-col gap-2">
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
            <div className="h-5 w-5 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
