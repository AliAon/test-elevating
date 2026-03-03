import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetUsersQuery } from "@/redux/services/auth-api";
import { useGetAllLogsQuery } from "@/redux/services/log-api";
import { format } from "date-fns";
import { ChevronRight, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AdminLogFilterPopup from "./admin-log-filter-popup";
import { useUser } from "@/hooks/useUserType";
import Paginate from "@/components/common/paginate";
const all_logs_tabs = [
  {
    key: "all",
    title: "All Logs",
  },
  {
    key: "general",
    title: "General Logs ",
  },
  {
    key: "audit",
    title: "Audit Logs",
  },
  {
    key: "user_activity",
    title: "User Activity Logs",
  },
];

export default function AdminLogs() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get("page") ?? page;
  const user = useUser();
  const [setOpen] = useState(false);
  const [active, setActive] = useState("all");
  const [filters, setFilters] = useState({
    sortBy: "",
    area: "",
    dateFrom: "",
    dateTo: "",
    timeFrom: "",
    timeTo: "",
    user_id: "",
    page: page,
    limit: 30,
    log_enum: "all",
  });

  const { data: users } = useGetUsersQuery(
    {
      user_type_id:
        "21661987-bbca-48bb-aa4b-1e6faa4895c8|7c0be78a-8d89-43bd-a014-4d31e6d7f85a",
      limit: 100,
    },
    {
      skip:
        user?.user_type_id !==
        "21661987-bbca-48bb-aa4b-1e6faa4895c8|7c0be78a-8d89-43bd-a014-4d31e6d7f85a",
    },
  );
  const usersData = users?.data;

  if (filters.log_enum == "all") {
    delete filters.log_enum;
  }

  const debounce = useDebounce(search, 300);
  const {
    data: logs,
    isLoading,
    isFetching,
  } = useGetAllLogsQuery(
    {
      ...filters,
      page: currentPage,
      limit: 30,
      client_id: user?.user_id,
    },
    {
      skip: !user?.user_id,
    },
  );

  useEffect(() => {
    setFilters({ ...filters, area: debounce });
  }, [debounce]);

  return (
    <div className="bg-bg_primary rounded-3xl p-6 mt-5">
      <p className="text-2xl text-text_primary font-semibold">All Logs</p>

      <div className="flex items-center justify-between">
        <div
          style={{
            background: "#ffffff",
          }}
          className="w-fit h-13 flex items-center rounded-2xl  p-1 mt-5"
        >
          {all_logs_tabs.map((tab) => (
            <button
              key={tab.key}
              className={`h-full text-sm font-medium cursor-pointer rounded-2xl transition-colors px-5 ${
                active == tab.key
                  ? "bg-[#F3F3F3] text-text_primary"
                  : "text-text_secondary"
              }`}
              onClick={() => {
                setActive(tab.key);
                setFilters({ ...filters, log_enum: tab.key });
              }}
            >
              {tab.title}
            </button>
          ))}
        </div>
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
            <AdminLogFilterPopup filters={filters} setFilters={setFilters} />
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
            : logs?.data?.map((item) => (
                <TableRow
                  key={item._id}
                  item={item}
                  setOpen={setOpen}
                  users={usersData}
                />
              ))}
        </div>
      </div>

      <div>
        <Paginate
          totalPages={logs?.totalPages}
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
      <div className="w-[200px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Type
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[280px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Date
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Time
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[220px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Area
        <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[200px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        User <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-[300px] flex items-center gap-2 text-xs text-gray-600 font-semibold px-4 uppercase tracking-wide">
        Description <ChevronsUpDown size={14} className="text-gray-400" />
      </div>
      <div className="w-12"></div>
    </div>
  );
}

function TableRow({ item, setOpen, users }) {
  const { area, createdAt, description, user_name, type } = item || {};

  return (
    <div className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 group">
      <div className="w-[200px] p-4 space-y-1">
        {type == "error" ? (
          <p className=" text-red-500 text-sm capitalize  font-semibold line-clamp-1">
            {type ?? "-"}
          </p>
        ) : (
          <p className=" text-green-500 text-sm capitalize  font-semibold line-clamp-1">
            {type ?? "-"}
          </p>
        )}
      </div>
      <div className="w-[280px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold line-clamp-1">
          {format(createdAt, "dd MMMM yyyy")}
        </p>
      </div>

      <div className="w-[200px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold line-clamp-1">
          {format(createdAt, "hh:mm a")}
        </p>
      </div>

      <div className="w-[220px] p-4 space-y-1">
        <div className="flex items-center gap-2">
          <p
            title={area}
            className="text-sm text-gray-900 font-semibold line-clamp-1 flex-1"
          >
            {area}
          </p>
        </div>
      </div>
      <div className="w-[200px] p-4 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#C2285A26] text-xs font-semibold text-[#B468B9]">
            {user_name?.charAt(0) || "-"}
          </div>
          <p className="text-sm text-text_primary font-semibold">
            {user_name || "-"}
          </p>
        </div>
      </div>

      <div className="w-[300px] p-4 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">{description}</p>
      </div>

      <div className="w-12 flex items-center justify-center p-4">
        <Link to={`/`}>
          <ChevronRight
            size={18}
            className="text-gray-400 group-hover:text-primary transition-colors cursor-pointer"
          />
        </Link>
      </div>
    </div>
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
