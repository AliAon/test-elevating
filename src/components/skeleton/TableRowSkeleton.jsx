import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TableRowSkeleton() {
  return (
    <div className="w-full flex items-center justify-between bg-white rounded-2xl animate-pulse">
      <div className="w-[165px] flex items-center gap-2 p-4">
        <Skeleton className="h-4 w-24 rounded-full" />
      </div>
      <div className="w-[152px] flex items-center gap-2 p-4">
        <Skeleton className="h-4 w-20 rounded-full" />
      </div>
      <div className="w-[335px] flex items-center gap-2 p-4">
        <Skeleton className="h-4 w-full rounded-full" />
      </div>
      <div className="w-[112px] flex items-center gap-2 p-4">
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <div className="w-[170px] flex items-center gap-2 p-4">
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <div className="w-[120px] flex items-center gap-2 p-4 flex items-center">
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-full ml-2" />
      </div>
    </div>
  );
}
