import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminClientCardSkeleton() {
  return (
    <div className="flex flex-col justify-between bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
      <div className="p-5">
        {/* Badge */}
        <Skeleton className="h-5 w-28 rounded-full mb-4" />

        {/* Logo */}
        <Skeleton className="h-12 w-12 rounded-lg mb-4" />

        {/* Title */}
        <Skeleton className="h-5 w-40 mb-1.5" />

        {/* Address */}
        <Skeleton className="h-3 w-56 mb-4" />

        {/* Divider */}
        <div className="h-px bg-gray-100 my-4" />

        {/* Contact Details */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="border-t border-gray-100">
        <Skeleton className="h-11 w-full rounded-none rounded-b-lg" />
      </div>
    </div>
  );
}
