import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import TableRowSkeleton from "./TableRowSkeleton";
import TableHeaderSkeleton from "../service-contracts/contarct-details/table-header-skeleton";

export default function ContractDetailsSkeleton() {
  return (
    <div>
      {/* Contract Header Skeleton */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <Skeleton className="h-8 w-64 mb-2 rounded-xl" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-1.5 w-1.5 rounded-full" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <Skeleton className="h-4 w-48 mb-2 rounded-xl" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <div className="w-[1px] h-12 bg-[#EAECEF]" />
          <Skeleton className="h-11 w-40 rounded-full" />
        </div>
      </div>

      {/* Statistics Skeleton */}
      <div className="grid grid-cols-3 gap-3 mt-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-bg_primary rounded-xl py-6 px-4">
            <Skeleton className="h-4 w-24 mb-2 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-xl" />
          </div>
        ))}
      </div>

      {/* KPI Cards Skeleton */}
      <div className="bg-bg_primary rounded-xl p-6 mt-5">
        <Skeleton className="h-6 w-48 mb-5 rounded-xl" />
        <div className="grid grid-cols-3 gap-3">
          {Array(9)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white rounded-xl p-5"
              >
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-2 rounded-full" />
                  <Skeleton className="h-6 w-16 mb-1 rounded-xl" />
                  <Skeleton className="h-3 w-20 rounded-full" />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Equipment List Skeleton */}
      <div className="bg-bg_primary rounded-xl p-6 mt-5">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-11 w-64 rounded-2xl" />
            <Skeleton className="h-11 w-28 rounded-2xl" />
          </div>
        </div>
        <TableHeaderSkeleton />
        <div className="mt-2 min-w-[600px] space-y-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
        </div>
      </div>
    </div>
  );
}
