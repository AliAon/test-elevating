import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function ContactRowSkeleton({ className }) {
  return (
    <div
      role="status"
      aria-label="Loading contact row"
      className={cn("rounded-2xl bg-card px-4 py-3 shadow-sm", className)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="min-w-0 flex-1">
            {/* name */}
            <Skeleton className="h-4 w-40 rounded md:w-56" />
            {/* phone + email */}
            <div className="mt-2 flex items-center gap-3">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="hidden h-3 w-48 rounded sm:block" />
            </div>
          </div>
        </div>

        {/* Right: company + note/status (hidden on small screens) */}
        <div className="hidden items-center gap-10 md:flex">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>

        {/* Chevron */}
        <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
      </div>
    </div>
  );
}

export function ContactListSkeleton({ count = 5, className }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ContactRowSkeleton key={i} />
      ))}
    </div>
  );
}
