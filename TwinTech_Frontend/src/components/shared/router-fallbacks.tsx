import { Link, useRouter } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";

export function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <ErrorState
      detail={error.message}
      onRetry={() => {
        void router.invalidate();
        reset();
      }}
    />
  );
}

export function DefaultNotFoundComponent() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16">
      <EmptyState
        icon={Compass}
        title="We couldn't find that record"
        description="The link may be out of date, or the record was removed from this workspace."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link to="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Contact support</Link>
            </Button>
          </div>
        }
      />
    </div>
  );
}