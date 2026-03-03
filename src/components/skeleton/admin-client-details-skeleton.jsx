import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const FIELDS = [
  { id: "business-name", labelWidth: "w-28", valueWidth: "w-40" },
  { id: "contact-person", labelWidth: "w-24", valueWidth: "w-32" },
  { id: "job-title", labelWidth: "w-24", valueWidth: "w-28" },
  { id: "phone", labelWidth: "w-24", valueWidth: "w-32" },
  { id: "email", labelWidth: "w-24", valueWidth: "w-56" },
  { id: "headquarters", labelWidth: "w-28", valueWidth: "w-64" },
  { id: "country", labelWidth: "w-20", valueWidth: "w-24" },
  { id: "state", labelWidth: "w-16", valueWidth: "w-12" },
  { id: "city", labelWidth: "w-12", valueWidth: "w-24" },
  { id: "postal", labelWidth: "w-20", valueWidth: "w-16" },
  { id: "abn", labelWidth: "w-24", valueWidth: "w-36" },
  { id: "entity-name", labelWidth: "w-28", valueWidth: "w-40" },
];

function FieldSkeleton({ labelWidth, valueWidth }) {
  return (
    <Card className="border bg-card border-transparent">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* icon bubble */}
          <div className="shrink-0">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          {/* text stack */}
          <div className="flex-1 space-y-2">
            <Skeleton className={["h-3", labelWidth].join(" ")} />
            <Skeleton className={["h-4", valueWidth].join(" ")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminClientDetailsSkeleton() {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-label="Loading business details"
      className="w-full my-5"
    >
      <span className="sr-only">Loading business details…</span>

      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {FIELDS.map((f) => (
          <FieldSkeleton key={f.id} {...f} />
        ))}
      </div>
    </section>
  );
}
