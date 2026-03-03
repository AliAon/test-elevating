import { Breadcrumbs } from "@/components/common/breadcrumbs";
import Paginate from "@/components/common/paginate";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetAllGroupsQuery } from "@/redux/services/groups";
import { ChevronRight, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function AdminCapitalBudget() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get("page") ?? page;

  const debounce = useDebounce(search, 300);
  const { data, isLoading, isFetching } = useGetAllGroupsQuery({
    search: debounce,
    page: currentPage,
    limit: 30,
  });
  const equipmentlist = [
    {
      item: "Capital Budget",
      link: "/admin/capital-budget",
    },

    {
      item: `Equipments Budget`,
      link: "#",
    },
  ];

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <Breadcrumbs list={equipmentlist} />

      <div className="flex items-center justify-between">
        <p className="text-2xl text-text_primary font-semibold">
          Capital Budget - Equipment Groups
        </p>
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
              placeholder="Search for the name"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            />
          </div>
          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <SlidersHorizontal size={20} className="text-text_secondary" />
            <p className="text-sm text-text_secondary font-semibold">Filter</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-8">
        <TableHeader />
        <div className="mt-2 min-w-[1100px] space-y-2">
          {isLoading || isFetching
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                <TableRowSkeleton key={item} />
              ))
            : data?.data?.groups?.map((item) => (
                <TableRow key={item._id} item={item} />
              ))}
        </div>
      </div>

      <div>
        <Paginate
          totalPages={data?.data?.pagination?.pages}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="min-w-[1100px] h-10 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-2">
      <div className="w-[220px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Group Name
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[280px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Building
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Subscription
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Service Contract
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[120px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Equipments
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-12"></div>
    </div>
  );
}

function TableRow({ item }) {
  const {
    id,
    groupname,
    description,
    equipment_ids,
    building_name,
    building_details,
    es_subscription_name,
    service_contract_name,
  } = item || {};

  const fullAddress = [
    building_details?.address,
    building_details?.city,
    building_details?.state,
    building_details?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      to={`/admin/capital-budget/details?group_id=${id}`}
      className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 group cursor-pointer"
    >
      <div className="w-[220px] p-4 space-y-1">
        <p
          title={groupname}
          className="text-sm text-gray-900 font-semibold line-clamp-1"
        >
          {groupname}
        </p>
        {description && description !== "No description" && (
          <p className="text-xs text-gray-500 font-medium line-clamp-1">
            {description}
          </p>
        )}
      </div>

      <div className="w-[280px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold line-clamp-1">
          {building_name || "N/A"}
        </p>
        {fullAddress && (
          <p className="text-xs text-gray-500 font-medium line-clamp-1">
            {fullAddress}
          </p>
        )}
      </div>

      <div className="w-[200px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold line-clamp-1">
          {es_subscription_name || "N/A"}
        </p>
      </div>

      <div className="w-[200px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold line-clamp-1">
          {service_contract_name || "N/A"}
        </p>
      </div>

      <div className="w-[120px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">
          {equipment_ids?.length || 0}
        </p>
      </div>

      <div className="w-12 flex items-center justify-center p-4">
        <ChevronRight
          size={18}
          className="text-gray-400 group-hover:text-primary transition-colors"
        />
      </div>
    </Link>
  );
}

function TableRowSkeleton() {
  return (
    <div className="w-full flex items-center justify-between border border-gray-200 bg-white rounded-lg">
      <div className="w-[220px] p-4 space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      <div className="w-[280px] p-4 space-y-1">
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      <div className="w-[200px] p-4">
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="w-[200px] p-4">
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="w-[120px] p-4">
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="w-12 flex items-center justify-center p-4">
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}
