import { SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";
import { Input } from "../ui/input";
import TableHeader from "./table-header";
import TableRow from "./table-row";
import TableRowSkeleton from "../skeleton/table-row-skeleton";
import AdminLogFilterPopup from "@/pages/admin/adminLogs/admin-log-filter-popup";

export default function UserServicesContarct({
  contracts,
  isLoading,
  setSearch,
  search,
  setSearchParams,
  searchParams,
  filters,
  setFilters,
}) {
  const [sortkey, setSortkey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold text-black">Service Contracts</p>
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
              value={search}
              onChange={(e) => {
                setSearch(e?.target?.value);
                const existingParams = Object.fromEntries(
                  searchParams.entries(),
                );
                setSearchParams({
                  ...existingParams,
                  search: e?.target?.value,
                });
              }}
              placeholder="Search contracts"
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            />
          </div>
          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <AdminLogFilterPopup filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-8">
        <TableHeader onSetSortkey={setSortkey} onSetSortOrder={setSortOrder} />
        <div className="mt-2 min-w-[700px] space-y-2">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))
            : [...(contracts || [])]
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
                .map((row) => <TableRow key={row?.contract_id} row={row} />)}
        </div>
      </div>
    </div>
  );
}
