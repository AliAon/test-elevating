import AdminClientCard from "@/components/admin/dashboard/client-card";
import AdminClientCardSkeleton from "@/components/admin/dashboard/client-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetAllClientsQuery } from "@/redux/services/admin-client";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminDashboardFilterPopup from "./admin-dashboard-filter-popup";
import Paginate from "@/components/common/paginate";

export default function ClientList() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: "",
    dateFrom: "",
    dateTo: "",
    page: page,
    limit: 30,
  });
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
      <div className="bg-bg_primary rounded-xl p-6 mt-8">
        <div className="flex items-center justify-between">
          <p className="text-2xl text-text_primary font-semibold">
            Clients
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
              onClick={() => navigate("/admin/onboarding-client")}
              className="w-[139px] h-11 rounded-full text-sm font-semibold"
            >
              Onboarding
            </Button>

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
