import { Skeleton } from "@/components/ui/skeleton";

export default function TableRowSkeleton() {
  return (
    <div className="w-full flex items-start justify-between bg-white rounded-2xl animate-in fade-in duration-300">
      {/* Contract Info */}
      <div className="w-[211px] p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      {/* Buildings */}
      <div className="w-[145px] p-4 space-y-2">
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Contract Type */}
      <div className="w-[180px] p-4 space-y-2">
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>

      {/* Service Provider */}
      <div className="w-[320px] p-4 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      {/* Dates */}
      <div className="w-[211px] flex items-start gap-2 p-4">
        <Skeleton className="h-10 w-[14px]" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center p-4">
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}
