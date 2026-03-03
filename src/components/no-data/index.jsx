import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from "@/components/ui/empty";
import { Inbox } from "lucide-react";

export default function NoDataFound() {
  return (
    <main className="min-h-dvh bg-background">
      <section className="mx-auto max-w-3xl md:p-12">
        <Empty className="bg-card text-card-foreground">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Inbox aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No data found</EmptyTitle>
            <EmptyDescription>
              We couldn’t find any records to display. Try adjusting your
              filters or create a new item.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </section>
    </main>
  );
}
