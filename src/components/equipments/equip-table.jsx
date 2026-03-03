"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { ChevronRight, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useGetAllEquipmentsQuery } from "@/redux/services/groups";
import SkeletonRow from "./skeleton-row";
import Paginate from "../common/paginate";
import { useDebounce } from "@/hooks/useDebounce";

export const tabs = [
  { key: "all", title: "All" },
  { key: "ESCALATOR", title: "Escalators" },
  { key: "ELEVATOR", title: "Elevators" },
];

export default function EquipTable({ buildingId }) {
  // Disabled - equipment list section
  return null;

  const [active, setActive] = useState(tabs[0].key);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(search, 300);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page");

  const { data: equipments = [], isLoading } = useGetAllEquipmentsQuery({
    search: debouncedQuery,
    page,
    limit: 10,
    equipmentType: active === "all" ? "" : active,
    buildingId,
  });

  useEffect(() => {
    if (currentPage) setPage(parseInt(currentPage));
  }, []);

  const handleTabClick = (key) => {
    setActive(key);
    const existingParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...existingParams, equipmentType: key });
  };

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      {/* Tabs + Search */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center rounded-2xl bg-white p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`text-sm font-medium rounded-2xl transition-colors px-5 py-2 ${
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
          <div className="relative w-[280px] h-11 bg-gradient-to-r from-[#FFCBB6] to-primary/0 rounded-2xl p-[1px]">
            <img
              src="/assets/svg/search.svg"
              alt="search"
              width={24}
              height={24}
              className="absolute top-1/2 -translate-y-1/2 left-5"
            />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                const existingParams = Object.fromEntries(
                  searchParams.entries()
                );
                setSearchParams({ ...existingParams, search: e.target.value });
              }}
              placeholder="Search Equipment by Name"
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            />
          </div>

          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <SlidersHorizontal size={20} className="text-text_secondary" />
            <p className="text-sm text-text_secondary font-semibold">Filter</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full mt-8 overflow-x-auto">
        <div className="min-w-[1400px]">
          {" "}
          <TableHeader />
          <div className="mt-2 space-y-2">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : equipments?.data?.length > 0 ? (
              equipments?.data?.map((item) => (
                <TableRow key={item.equipment_id} item={item} />
              ))
            ) : (
              <p className="text-center text-sm text-text_secondary py-4">
                No equipments found.
              </p>
            )}
          </div>
        </div>
      </div>
      <Paginate
        totalPages={equipments?.pagination?.pages}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
}

const columns = [
  "Group",
  "Equipment",
  "ID",
  "Type",
  "No. Floors",
  "Model And MFG",
  "Equipment Life",
  "Status",
];

function TableHeader() {
  return (
    <div
      className="grid items-center bg-transparent text-xs text-text_secondary font-medium px-4"
      style={{
        gridTemplateColumns: "repeat(8, 1fr)",
      }}
    >
      {columns.map((title, index, arr) => (
        <div
          key={title}
          className={`flex items-center ${
            index == arr.length - 1 && "justify-end"
          }  gap-2 whitespace-nowrap`}
        >
          {title}
          <ChevronsUpDown size={16} />
        </div>
      ))}
    </div>
  );
}
function TableRow({ item }) {
  return (
    <div
      className="grid items-center bg-white rounded-2xl px-4 py-3 text-sm"
      style={{
        gridTemplateColumns: "repeat(8, 1fr)",
      }}
    >
      {/* Property */}
      <div className="font-semibold text-text_primary truncate">
        {item.group_name || "N/A"}
      </div>

      {/* Equipment Name + Design */}
      <div>
        <p className="font-semibold text-text_secondary truncate w-[140px]">
          {item.equipment_name || "-"}
        </p>
      </div>

      {/* Equipment ID */}
      <div className="font-semibold text-text_secondary truncate">
        {item.equipment_id?.slice(0, 8) || "-"}
      </div>

      {/* Equipment Type */}
      <div className="font-semibold text-text_secondary truncate">
        {item.equipment_type || "N/A"}
      </div>

      {/* Floors */}
      <div className="font-semibold text-text_primary truncate">
        {item?.specification?.floor_to || "—"}
      </div>

      {/* model_number */}
      <div className="font-semibold text-text_secondary truncate">
        {item?.model_number}
        <p className={`text-xs font-medium text-text_secondary`}>MFG: Otis</p>
      </div>

      {/* Equiment Life */}
      <div className="font-semibold text-text_secondary truncate">
        {item.equipment_life + " years"}
      </div>

      {/* Status */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#1F98B2]" />
          <p className="font-semibold text-text_secondary">Active</p>
        </div>
        <Link to={`/equipment-details/${item.equipment_id}`}>
          <ChevronRight size={20} color="#898EA6" className="cursor-pointer" />
        </Link>
      </div>
    </div>
  );
}
