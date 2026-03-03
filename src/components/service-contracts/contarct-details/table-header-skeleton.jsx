import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TableHeaderSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between animate-pulse">
        {/* Title Skeleton */}
        <div className="h-8 w-[200px] bg-gray-200 rounded-md"></div>

        {/* Right Controls Skeleton */}
        <div className="flex items-center gap-4">
          {/* Search Skeleton */}
          <div className="relative w-[260px] h-11 bg-gray-300 rounded-2xl">
            <div className="absolute top-1/2 -translate-y-1/2 left-5 h-6 w-6 bg-gray-300 rounded-full"></div>
            <div className="w-full h-full bg-gray-100 rounded-2xl ps-12"></div>
          </div>

          {/* Filter Skeleton */}
          <div className="w-[105px] h-11 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>

      <div className="min-w-[600px] h-8 flex items-center justify-between">
        <div className="w-[165px] flex items-center gap-2 px-4">
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
        <div className="w-[152px] flex items-center gap-2 px-4">
          <Skeleton className="h-3 w-24 rounded-full" />
        </div>
        <div className="w-[335px] flex items-center gap-2 px-4">
          <Skeleton className="h-3 w-48 rounded-full" />
        </div>
        <div className="w-[112px] flex items-center gap-2 px-4">
          <Skeleton className="h-3 w-16 rounded-full" />
        </div>
        <div className="w-[170px] flex items-center gap-2 px-4">
          <Skeleton className="h-3 w-24 rounded-full" />
        </div>
        <div className="w-[120px] flex items-center gap-2 px-4">
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
      </div>
    </>
  );
}
