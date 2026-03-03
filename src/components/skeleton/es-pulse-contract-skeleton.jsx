import { Skeleton } from "@/components/ui/skeleton";

function EsPulseContractSkeleton({ className = "" }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading subscription card"
      className={`flex flex-col justify-between bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm ${className}`}
    >
      <div className="p-5">
        {/* Badge */}
        <Skeleton className="h-5 w-24 rounded-full mb-4" />

        {/* Title */}
        <Skeleton className="h-5 w-3/4 mb-1.5" />
        
        {/* Subtitle */}
        <Skeleton className="h-3 w-1/2 mb-4" />

        {/* Divider */}
        <div className="h-px bg-gray-100 my-4" />

        {/* Date Range */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3.5 w-8" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-3 w-16 mb-4" />

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
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default EsPulseContractSkeleton;
