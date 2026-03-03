import { Input } from "@/components/ui/input";
import React, { useMemo, useState } from "react";
import TableHeader from "../services-contract-list/table-header";
import TableRow from "../services-contract-list/table-row";
import { useGetAllServiceContractsQuery } from "@/redux/services/service-contracts";

export default function ContractPerson({ id }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useGetAllServiceContractsQuery(
    {
      es_subscription_id: id,
    },
    {
      skip: !id,
    },
  );

  // Skeleton loader for table rows
  const skeletonRows = Array.from({ length: 5 }).map((_, idx) => (
    <div
      key={idx}
      className="h-10 bg-gray-200 rounded-lg animate-pulse w-full"
    ></div>
  ));

  const filteredContracts = useMemo(() => {
    if (searchQuery) {
      return data?.data?.contracts.filter((contract) =>
        contract.contract_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }
    return data?.data?.contracts;
  }, [data, searchQuery]);

  return (
    <div className="bg-bg_primary rounded-xl p-6 mt-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl text-black font-semibold">Service Contracts</p>
        <div className="relative w-[260px] h-11 bg-gradient-to-r from-[#FFCBB6] to-primary/0 rounded-2xl p-[1px]">
          <img
            src="/assets/svg/search.svg"
            alt=""
            width={24}
            height={24}
            className="absolute top-1/2 -translate-y-1/2 left-5"
          />
          <Input
            placeholder="Search"
            className="w-full h-full text-sm placeholder:text-text_secondary font-semibold rounded-2xl bg-white border-0 ps-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-8">
        <TableHeader />
        <div className="mt-2 min-w-[700px] space-y-2">
          {isLoading
            ? skeletonRows
            : filteredContracts?.map((row) => (
                <TableRow key={row.id} row={row} />
              ))}
        </div>
      </div>
    </div>
  );
}
