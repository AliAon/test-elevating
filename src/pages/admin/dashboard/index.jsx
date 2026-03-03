import AdminClientCard from "@/components/admin/dashboard/client-card";
import AdminClientCardSkeleton from "@/components/admin/dashboard/client-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetAllClientsQuery } from "@/redux/services/admin-client";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AdminDashboardFilterPopup from "./admin-dashboard-filter-popup";
import Paginate from "@/components/common/paginate";
import {
  useGetAverageTimeQuery,
  useGetDashboardStatsQuery,
} from "@/redux/services/dashboard-api";

export default function AdminDashboard() {
  const [page, setPage] = useState(1);
  const { data: dataDashboard } = useGetDashboardStatsQuery();
  const yearlyData = dataDashboard?.yearly;
  const lastMonthData = dataDashboard?.lastMonth;
  const { data: averageTime } = useGetAverageTimeQuery();

  const [filters, setFilters] = useState({
    sortBy: "",
    dateFrom: "",
    dateTo: "",
    page: page,
    limit: 30,
  });
  const list = [
    {
      icon: "/assets/svg/admin-dashboard-1.svg",
      icon_bg: "#1F98B226",
      title: "Active Subscriptions",
      value: yearlyData?.subscriptions?.total,
      extra_label: yearlyData?.subscriptions?.percentage,
      tagline: `${yearlyData?.subscriptions?.percentage}% increase from previous year`,
      link: "/admin/es-pulse-subscriptions",
    },
    {
      icon: "/assets/svg/admin-dashboard-2.svg",
      icon_bg: "#248EA526",
      title: "Users",
      value: yearlyData?.users?.total,
      extra_label: yearlyData?.users?.percentage,
      tagline: `${yearlyData?.subscriptions?.percentage}% increase from previous year`,
      link: "/admin/es-clients",
    },
    {
      icon: "/assets/svg/admin-dashboard-3.svg",
      icon_bg: "#C2285A26",
      title: "Buildings",
      value: yearlyData?.buildings?.total,
      extra_label: yearlyData?.buildings?.percentage,
      tagline: `${yearlyData?.subscriptions?.percentage}% decrease from previous year`,
      link: "/admin/buildings",
    },
    {
      icon: "/assets/svg/admin-dashboard-4.svg",
      icon_bg: "#B468B926",
      title: "Equipment",
      value: yearlyData?.equipment?.total,
      extra_label: yearlyData?.equipment?.percentage,
      tagline: `${yearlyData?.subscriptions?.percentage}% increase from previous year`,
      link: "/admin/groups",
    },
    {
      icon: "/assets/svg/ActiveUsers.svg",
      icon_bg: "#F06B3C26",
      title: "Active Users",
      value: lastMonthData?.activeUsers,
      tagline: "Users logged in last month",
      link: "/admin/es-clients",
    },
    {
      icon: "/assets/svg/Average Time Spent.svg",
      icon_bg: "#B468B926",
      title: "Average Time Spent",
      value: averageTime?.average_session,
      tagline: "On site per month",
      link: "/admin/es-clients",
    },
    {
      icon: "/assets/svg/Avg. Logged in Count.svg",
      icon_bg: "#1F98B226",
      title: "Avg. Logged in Count",
      value: lastMonthData?.avgUsersCreatedPerMonth,
      tagline: "On this site per month",
      link: "/admin/es-clients",
    },
    {
      icon: "/assets/svg/New Logged in Count.svg",
      icon_bg: "#C2285A26",
      title: "New Logged in Count",
      value: lastMonthData?.newLoggedInCount,
      tagline: "On this site last month",
      link: "/admin/es-clients",
    },
  ];
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get("page");
  const [search, setSearch] = useState("");

  const debouncedQuery = useDebounce(search, 300);

  const {
    data: clients,
    isLoading,
    isFetching,
  } = useGetAllClientsQuery({
    filters: { ...filters, page: currentPage },
    debouncedQuery,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (currentPage) setPage(parseInt(currentPage));
    else setPage(1);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {list?.map((item, index) => (
          <Link key={index} to={item.link}>
            <Card item={item} />
          </Link>
        ))}
      </div>

      <div className="bg-bg_primary rounded-xl p-6 mt-8">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-text_primary font-semibold">
            Client List
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
                placeholder="Search contract list"
                className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <AdminDashboardFilterPopup
              filters={filters}
              setFilters={setFilters}
            />

            <Button
              onClick={() => navigate("/admin/add-update-client")}
              className="w-[139px] h-11 rounded-full text-sm font-semibold"
            >
              Add Client
            </Button>
          </div>
        </div>

        {isLoading || isFetching ? (
          <div className="grid grid-cols-3 gap-4 mt-5">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <AdminClientCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mt-5">
            {clients?.data?.map((client) => (
              <AdminClientCard client={client} key={client?.client_id} />
            ))}
          </div>
        )}
        <div>
          <Paginate
            totalPages={clients?.pagination?.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

const Card = ({ item }) => {
  return (
    <div className="flex items-center gap-3 bg-bg_primary rounded-xl px-4 py-6">
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full"
        style={{
          background: item.icon_bg,
        }}
      >
        <img src={item.icon} alt="" width={24} height={24} />
      </div>
      <div>
        <p className="text-sm text-text_primary font-medium">{item.title}</p>
        <p className="text-3xl text-text_primary font-semibold">{item.value}</p>

        {item.extra_label ? (
          <p className="text-xs text-text_secondary font-medium mt-1">
            <span
              className={`${
                item.title === "Buildings" ? "text-[#C2285A]" : "text-[#248EA5]"
              }`}
            >
              {item.extra_label}%{" "}
              {item.title === "Buildings" ? "decrease" : "increase"}
            </span>{" "}
            from previous year
          </p>
        ) : (
          <p className="text-xs text-text_secondary font-medium mt-1">
            {item.tagline}
          </p>
        )}
      </div>
    </div>
  );
};
