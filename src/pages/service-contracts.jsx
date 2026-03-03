import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ServicesStatistics from "@/components/service-contracts/statistics";
import UserServicesContarct from "@/components/service-contracts/main-section";
import { useGetContractsQuery } from "@/redux/services/contract";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import Paginate from "@/components/common/paginate";
import LevelsSelector from "@/components/common/levels-selector";
import { useSelector } from "react-redux";
import { useGetServiceContractStatsQuery } from "@/redux/services/service-contracts";
import { formatByDate } from "@/helpers/helper";
import { useUser } from "@/hooks/useUserType";
import { format } from "date-fns";

export default function ServiceContracts() {
  const [search, setSearch] = useState("");
  const debouncedQuery = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const user = useUser();
  const clientId = user?.es_subscriptions[0]?.client_id;

  const [status, setStatus] = useState("true");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page");
  const { subscription_id } = useSelector((state) => state.subscription_id);
  const { data: stats } = useGetServiceContractStatsQuery(
    {
      es_subscription_id: subscription_id,
      level1: level1?.level1_id,
      level2: level2?.level2_id,
      level3,
    },
    {
      skip: !subscription_id || !level1 || !level2 || !level3,
    },
  );
  const [filters, setFilters] = useState({
    type: "",
    dateTo: "",
    dateFrom: "",
  });

  const { data, isLoading, isFetching } = useGetContractsQuery(
    {
      filters: {
        page,
        limit: 10,
        subscription_id: subscription_id,
        active: status,
        dateFrom: filters?.dateFrom,
        dateTo: filters?.dateTo,
        contractType: filters?.type,
        clientId: clientId,
      },
      debouncedQuery: debouncedQuery,
    },
    {
      skip: !subscription_id,
    },
  );

  useEffect(() => {
    if (currentPage) setPage(parseInt(currentPage));
  }, []);

  const { contracts, pagination } = data?.data ?? {};

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 justify-between w-full">
          <div>
            <LevelsSelector
              level1={level1}
              setLevel1={setLevel1}
              level2={level2}
              setLevel2={setLevel2}
              level3={level3}
              setLevel3={setLevel3}
            />
          </div>
          <div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[165px] min-h-11 bg-[#F6F6F8] rounded-full font-semibold text-black">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-6">
        <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
          <ServicesStatistics summary={stats?.data} />
        </div>
        <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4">
          <UserServicesContarct
            search={search}
            contracts={contracts}
            setSearch={setSearch}
            isLoading={isLoading || isFetching}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {(contracts?.length > 9 || page !== 1) && (
          <div className="bg-gray-50 border border-gray-200 shadow-sm rounded-xl p-4 flex justify-center">
            <Paginate
              totalPages={pagination?.pages}
              currentPage={page}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
