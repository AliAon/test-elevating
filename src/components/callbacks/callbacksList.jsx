import React, { useState } from "react";
import { Input } from "../ui/input";
import { ChevronRight, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import CallbacksFilterPopup from "@/pages/callbacks/callbacks-filter-popup";

export default function CallbacksList({
  data,
  isLoading,
  setSearch,
  filters,
  setFilters,
}) {
  const [sortkey, setSortkey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-black font-semibold">Callbacks History</p>
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
          <div className="w-[105px] h-11 rounded-lg bg-white flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
            <CallbacksFilterPopup
              isShowEquipment={false}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-5">
        <TableHeader onsetSortkey={setSortkey} onsetSortOrder={setSortOrder} />
        {isLoading ? (
          <SkeletonRows />
        ) : data?.length === 0 ? (
          <p className="text-sm text-text_secondary font-bold text-center mt-10">
            No item found
          </p>
        ) : (
          <div className="mt-2 min-w-[900px] space-y-2">
            {[...(data || [])]
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
      </div>
    </div>
  );
}

function TableHeader({ onsetSortkey, onsetSortOrder }) {
  return (
    <div className="min-w-[900px] h-12 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
      <div className="w-[220px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4">
        Equipment
        <ChevronsUpDown
          size={14}
          className="cursor-pointer"
          onClick={() => {
            onsetSortkey("equipment_name");
            onsetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4">
        Date & Time
        <ChevronsUpDown
          size={14}
          className="cursor-pointer"
          onClick={() => {
            onsetSortkey("stopped_date");
            onsetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="flex-1 flex items-center gap-2 text-xs text-text_secondary font-semibold px-4">
        Issue
        <ChevronsUpDown
          size={14}
          className="cursor-pointer"
          onClick={() => {
            onsetSortkey("problem");
            onsetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </div>
      <div className="w-[160px] flex items-center gap-2 text-xs text-text_secondary font-semibold px-4">
        Status
        <ChevronsUpDown
          size={14}
          className="cursor-pointer"
          onClick={() => {
            onsetSortkey("status");
            onsetSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
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
    status,
    detailed_info,
  } = item || {};

  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase();
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
    return "bg-green-100 text-green-700";
  };

  return (
    <Link
      to={`/callbacks-details/${id}`}
      className="group min-w-[900px] bg-white rounded-lg border border-gray-200 flex items-stretch hover:shadow-sm transition-shadow cursor-pointer"
    >
      {/* Equipment Column */}
      <div className="w-[220px] flex flex-col gap-0.5 px-4 py-3">
        <p className="text-xs text-text_secondary">
          {detailed_info?.equipment_number || "N/A"}
        </p>
        <p className="text-sm text-text_primary font-semibold">
          {equipment_name || "N/A"}
        </p>
        <p className="text-xs text-text_secondary">{property_name || "N/A"}</p>
      </div>
      {/* Date & Time Column */}
      <div className="w-[200px] flex flex-col gap-1 px-4 py-3">
        <p className="text-sm text-text_primary font-semibold">
          {dayjs(stopped_date).format("DD MMM YYYY, HH:mm")}
        </p>
        <p className="text-xs text-text_secondary uppercase tracking-wide">
          {detailed_info?.unique_servie_id || "N/A"}
        </p>
      </div>

      {/* Issue Column */}
      <div className="flex-1 flex items-center px-4 py-3">
        <p className="text-sm text-text_secondary font-medium line-clamp-2">
          {problem || "N/A"}
        </p>
      </div>

      {/* Status Column */}
      <div className="w-[160px] flex items-center justify-between px-4 py-3">
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${getStatusStyle(
              status,
            )}`}
          >
            {status || "N/A"}
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

function SkeletonRows() {
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
