import Paginate from "@/components/common/paginate";
import EsPulseContractSkeleton from "@/components/skeleton/es-pulse-contract-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTypeColors } from "@/helpers/contract";
import { cn } from "@/lib/utils";
import AdminBuildingFilterPopup from "@/pages/admin/buildings/admin-building-filter-popup";
import AdminServiceContractFilterPopup from "@/pages/admin/service-contracts/admin-service-contract-filter-popup";
import { useGetContractsQuery } from "@/redux/services/contract";
import dayjs from "dayjs";
import { CirclePlus, SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AdminServices() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const currentPage = searchParams.get("page");
  const [filters, setFilters] = useState({
    clientId: "",
    es_subscription_id: "",
    buildingIds: [],
    contractType: "",
    brand_id: "",
  });
  const { data, isLoading } = useGetContractsQuery({
    filters: {
      page: currentPage,
      limit: 30,
      clientId: filters.clientId,
      es_subscription_id: filters.es_subscription_id,
      buildingIds: filters.buildingIds,
      contractType: filters.contractType,
      brand_id: filters.brand_id,
    },
  });
  const contracts = data?.data || [];
  const navigate = useNavigate();

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-text_primary font-semibold">
          Service Contracts
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
              placeholder="Search contracts"
              className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            />
          </div>
          <div className="w-[105px] h-11 rounded-2xl bg-white flex items-center justify-center gap-2 cursor-pointer">
            <AdminServiceContractFilterPopup
              filters={filters}
              setFilters={setFilters}
            />
          </div>

          <Button
            onClick={() => navigate("/admin/services-contracts-update")}
            className="w-[207px] h-11 rounded-full bg-[#eaecef] text-sm font-semibold text-text_primary"
          >
            <CirclePlus size={18} />
            Add Service Contract
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-3 gap-5 mt-8">
          <EsPulseContractSkeleton />
          <EsPulseContractSkeleton />
          <EsPulseContractSkeleton />
          <EsPulseContractSkeleton />
          <EsPulseContractSkeleton />
          <EsPulseContractSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5 mt-8">
          {contracts?.contracts?.map((contract) => (
            <Card key={contract?.contract_id} contract={contract} />
          ))}
        </div>
      )}
      <Paginate
        totalPages={data?.data?.pagination?.pages}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
}

const Card = ({ contract }) => {
  const typesColor = getTypeColors();
  const navigate = useNavigate();
  const {
    plan_and_pricing,
    contract_name,
    client_name,
    days_remaining,
    contract_number,
  } = contract || {};

  return (
    <div
      key={contract.id}
      className="flex flex-col justify-between bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
    >
      <div className="p-5">
        {/* Badge */}
        <div
          className={cn(
            "w-fit text-[10px] uppercase tracking-wide rounded-full px-2.5 py-1 mb-4 urbanist font-semibold",
          )}
          style={{ backgroundColor: typesColor?.bg, color: typesColor?.text }}
        >
          {plan_and_pricing?.contract_type}
        </div>

        {/* Price */}
        <p className="text-2xl font-bold text-green-600 mb-2">
          ${" "}
          {Number(plan_and_pricing?.contract_price || 0).toLocaleString(
            "en-US",
          )}
        </p>

        {/* Title */}
        <h3 className="text-lg text-gray-900 font-semibold leading-tight">
          {contract_name}
        </h3>

        {/* Contract Details */}
        <p className="text-xs text-gray-500 font-medium mt-1.5">
          {contract_number}
        </p>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Client: {client_name}
        </p>

        <div className="h-px bg-gray-100 my-4" />

        {/* Date Range */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 flex items-center justify-center opacity-60">
              <img src="/assets/svg/date.svg" alt="" width={14} height={14} />
            </div>
            <p className="text-xs text-gray-600 font-medium">
              Start: {dayjs(contract.start_date).format("MMM DD, YYYY")}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 flex items-center justify-center opacity-60">
              <img src="/assets/svg/date.svg" alt="" width={14} height={14} />
            </div>
            <p className="text-xs text-gray-600 font-medium">
              End: {dayjs(contract.end_date).format("MMM DD, YYYY")}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-600 shadow-sm"></div>
            </div>
            <p
              className={cn(
                "text-xs font-semibold",
                contract?.days_remaining < 0
                  ? "text-red-600"
                  : contract?.days_remaining < 16
                    ? "text-primary"
                    : "text-green-600",
              )}
            >
              {days_remaining} Days left
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="border-t border-gray-100">
        <Button
          className="bg-white hover:bg-gray-50 px-4 py-3 w-full rounded-none rounded-b-lg border-0 text-primary hover:text-primary font-semibold text-sm transition-colors"
          variant={"ghost"}
          onClick={() =>
            navigate(
              `/admin/services-contracts-details/${contract?.contract_id}`,
            )
          }
        >
          Open Details
        </Button>
      </div>
    </div>
  );
};
