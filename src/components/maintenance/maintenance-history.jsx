import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { ChevronsUpDown, SlidersHorizontal, ChevronRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetMaintenanceHistoryQuery } from "@/redux/services/maintenance";
import Paginate from "../common/paginate";
import { useDebounce } from "@/hooks/useDebounce";
import CallbacksFilterPopup from "@/pages/callbacks/callbacks-filter-popup";

export default function MaintenanceHistory({ equipment_id }) {
  const subscription_id = useSelector(
    (state) => state.subscription_id.subscription_id,
  );
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const debounce = useDebounce(search, 300);
  const [sortkey, setSortkey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  const [page, setPage] = useState(1);
  const currentPage = searchParams.get("page");
  const [filters, setFilters] = useState({});

  const { data, isLoading, isError } = useGetMaintenanceHistoryQuery(
    {
      es_subscription_id: subscription_id,
      equipment_id: equipment_id || filters.equipment_id,
      page,
      search_property: debounce || filters.property,
      status: filters.status,
      date_from: filters.date_from,
      date_to: filters.date_to,
    },
    {
      skip: !subscription_id,
    },
  );

  const history = data?.data?.history || [];
  useEffect(() => {
    if (currentPage) setPage(parseInt(currentPage));
  }, []);
  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-black font-semibold">Maintenance History</p>
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
            {/* <SlidersHorizontal size={20} className="text-text_secondary" /> */}
            {/* <p className="text-sm text-text_secondary font-semibold">Filter</p> */}
            <CallbacksFilterPopup filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-5">
        <TableHeader onSetSortkey={setSortkey} onSetSortOrder={setSortOrder} />
        <div className="mt-2 min-w-[900px] space-y-2">
          {isLoading && (
            <>
              {[...Array(4)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </>
          )}
          {isError && (
            <div className="text-center py-8 text-red-500">
              Failed to load maintenance history.
            </div>
          )}
          {!isLoading && !isError && history.length === 0 && (
            <div className="text-center py-8 text-text_secondary">
              No maintenance history found.
            </div>
          )}
          {!isLoading &&
            !isError &&
            [...(history || [])]
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
              .map((row) => <TableRow key={row.id} row={row} />)}
        </div>
        <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4 flex justify-center">
          <Paginate
            totalPages={data?.data.pagination?.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );

  function SkeletonRow() {
    return (
      <div className="flex items-stretch bg-white rounded-2xl border border-[#EAECEF] overflow-hidden animate-pulse mb-2">
        <div className="flex flex-col justify-center w-[180px] px-6 py-4 border-r border-[#F3F3F3]">
          <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </div>
        <div className="flex flex-col justify-center w-[220px] px-6 py-4 border-r border-[#F3F3F3]">
          <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
        <div className="flex flex-col justify-center w-[180px] px-6 py-4 border-r border-[#F3F3F3]">
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
        <div className="flex flex-col justify-center w-[320px] px-6 py-4 border-r border-[#F3F3F3]">
          <div className="h-5 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-40 bg-gray-100 rounded" />
        </div>
        <div className="flex items-center px-4">
          <div className="h-6 w-6 bg-gray-200 rounded-full" />
        </div>
      </div>
    );
  }

  function TableHeader({ onSetSortkey, onSetSortOrder }) {
    return (
      <div className="min-w-[900px] h-11 flex items-center justify-between bg-white border border-gray-200 rounded-lg px-2">
        <div className="w-[220px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
          Property
          <ChevronsUpDown
            size={14}
            className="text-gray-400 cursor-pointer"
            onClick={() => {
              onSetSortkey("property_name");
              onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            }}
          />
        </div>
        <div className="w-[180px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
          Date
          <ChevronsUpDown
            size={14}
            className="text-gray-400 cursor-pointer"
            onClick={() => {
              onSetSortkey("planned_date");
              onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            }}
          />
        </div>
        <div className="w-[220px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
          Equipment
          <ChevronsUpDown
            size={14}
            className="text-gray-400 cursor-pointer"
            onClick={() => {
              onSetSortkey("equipment_name");
              onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            }}
          />
        </div>
        <div className="w-[180px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
          Provider
          <ChevronsUpDown
            size={14}
            className="text-gray-400 cursor-pointer"
            onClick={() => {
              onSetSortkey("equipment_name");
              onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            }}
          />
        </div>
        <div className="w-[220px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
          Status
          <ChevronsUpDown
            size={14}
            className="text-gray-400 cursor-pointer"
            onClick={() => {
              onSetSortkey("status");
              onSetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
            }}
          />
        </div>
        <div className="w-[50px]" />
      </div>
    );
  }

  function TableRow({ row }) {
    // Date logic: show solve_date, below planned_date, and pill for Delayed/On Time
    const plannedDate = row.planned_date ? new Date(row.planned_date) : null;
    const completedDate = row.completed_date
      ? new Date(row.completed_date)
      : null;
    let pillType = null;
    if (plannedDate && completedDate) {
      if (row.status === "Planned") {
        pillType = "Planned";
      } else if (
        completedDate.getFullYear() > plannedDate.getFullYear() ||
        (completedDate.getFullYear() === plannedDate.getFullYear() &&
          completedDate.getMonth() > plannedDate.getMonth())
      ) {
        pillType = "Delayed";
      } else if (
        completedDate.getFullYear() === plannedDate.getFullYear() &&
        completedDate.getMonth() === plannedDate.getMonth()
      ) {
        pillType = "On Time";
      } else if (
        completedDate.getFullYear() < plannedDate.getFullYear() ||
        (completedDate.getFullYear() === plannedDate.getFullYear() &&
          completedDate.getMonth() < plannedDate.getMonth())
      ) {
        pillType = "Advance";
      }
    }

    // Status pill color
    let statusColor = "bg-indigo-100 text-indigo-600";
    if (row.status.toLowerCase() === "closed")
      statusColor = "bg-green-100 text-green-600";
    if (row.status.toLowerCase() === "open")
      statusColor = "bg-blue-100 text-blue-600";
    if (row.status.toLowerCase() === "delayed")
      statusColor = "bg-red-100 text-red-600";
    if (row.status.toLowerCase() === "advance")
      statusColor = "bg-indigo-100 text-indigo-600";
    if (row.status.toLowerCase() === "planned")
      statusColor = "bg-purple-100 text-purple-600";

    return (
      <div
        className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 group cursor-pointer"
        onClick={() =>
          (window.location.href = `/planned-maintenance/${row.id}/${row.equipment_id}`)
        }
      >
        {/* Equipment */}
        <div className="w-[220px] p-4 space-y-1">
          <span className="text-sm text-gray-900 font-semibold">
            {row.property_name}
          </span>
        </div>
        {/* Date */}
        <div className="w-[180px] p-4 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-900 font-semibold">
              {completedDate ? completedDate.toLocaleDateString() : "-"}
            </span>
            {pillType && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  pillType === "Delayed"
                    ? "bg-red-100 text-red-600"
                    : pillType === "Advance"
                      ? "bg-indigo-100 text-indigo-600"
                      : pillType === "Planned"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-green-100 text-green-600"
                }`}
              >
                {pillType}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-600 font-medium">
            Planned for: {plannedDate ? plannedDate.toLocaleDateString() : "-"}
          </span>
        </div>
        {/* Equipment */}
        <div className="w-[220px] p-4 space-y-1">
          <span className="text-sm text-gray-900 font-semibold">
            {row.equipment_name}
          </span>
          <br></br>
          <span className="text-xs text-gray-600">{row.property_name}</span>
        </div>
        {/* Provider */}
        <div className="w-[180px] p-4 space-y-1">
          <span className="text-sm text-gray-900 font-semibold">
            {row.service_provider_brand}
          </span>
        </div>
        {/* Status & Problem */}
        <div className="w-[220px] p-4 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor}`}
            >
              {row.status}
            </span>
          </div>
          <span className="text-xs text-gray-600 whitespace-pre-line">
            {row.problem}
          </span>
        </div>
        {/* Chevron */}
        <div className="w-[50px] p-4 flex items-center justify-center">
          <ChevronRight
            size={18}
            className="text-gray-400 group-hover:text-primary transition-colors"
          />
        </div>
      </div>
    );
  }
  function SkeletonRow() {
    return (
      <div className="w-full flex items-center justify-between border border-gray-200 bg-white rounded-lg animate-pulse mb-2">
        {/* Date Column */}
        <div className="w-[180px] p-4 space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
        </div>
        {/* Equipment Column */}
        <div className="w-[220px] p-4 space-y-2">
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
        </div>
        {/* Provider Column */}
        <div className="w-[180px] p-4 space-y-2">
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
        {/* Status Column */}
        <div className="w-[220px] p-4 space-y-2">
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
        </div>
        {/* Chevron */}
        <div className="w-[50px] p-4 flex items-center justify-center">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
        </div>
      </div>
    );
  }
}
