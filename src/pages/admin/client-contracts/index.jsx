import ClientServiceContract from "@/components/admin/client-contracts/service-contract";
import Paginate from "@/components/common/paginate";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetClientByIdQuery } from "@/redux/services/admin-client";
import { useGetAllServiceContractsQuery } from "@/redux/services/service-contracts";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AdminClientsContracts() {
  const [params] = useSearchParams();
  const clientId = params.get("clientId");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    clientId: "",
    es_subscription_id: "",
    buildingIds: [],
    contractType: "",
    brand_id: "",
  });
  const currentPage = params.get("page") ?? page;
  const { data: client } = useGetClientByIdQuery(clientId, {
    skip: !clientId,
  });
  const debounce = useDebounce(search, 300);
  const { data: subscriptions, isLoading } = useGetAllServiceContractsQuery({
    search: debounce,
    page: currentPage,
    limit: 30,
    client_id: clientId,
    es_subscription_id: filters.es_subscription_id,
    buildingIds: filters.buildingIds,
    contractType: filters.contractType,
    brand_id: filters.brand_id,
  });
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-[86px] h-[66px] flex items-center justify-center rounded-2xl border border-[#EAECEF]">
            <img src={client?.data?.logo_url} alt="" width={58} height={48} />
          </div>
          <div>
            <p className="text-3xl text-text_primary font-semibold">
              {client?.data?.client_name}
            </p>
            <div className="mt-1">
              <p className="text-sm text-text_secondary font-medium">
                {client?.data?.HQ_address}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <p className="text-sm text-text_primary font-semibold">
              ES Pulse - Sydney Corporate Towers
            </p>
          </div>
          <div className="w-[1px] h-12 bg-[#EAECEF]" />
          {/* <Button
            onClick={() => navigate("/admin/clients-es-subscription")}
            className="w-[172px] h-11 rounded-full text-sm font-semibold"
          >
            Check Contracts <ChevronRight />
          </Button> */}
        </div>
      </div>
      <ClientServiceContract
        subscriptions={subscriptions?.data}
        isLoading={isLoading}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        search={search}
      />
      <div>
        <Paginate
          totalPages={subscriptions?.data?.pagination?.pages}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
