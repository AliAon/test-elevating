import { Skeleton } from "@/components/ui/skeleton";

const BuildingSkeleton = () => {
  return (
    <div className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="w-[200px] space-y-2">
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="w-[180px] space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      <div className="w-[250px] space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>

      <div className="w-[220px] space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      <div className="w-[120px] space-y-2">
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="w-12 flex items-center justify-center">
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
};

export default BuildingSkeleton;
