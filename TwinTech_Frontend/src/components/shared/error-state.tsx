import { Link } from "@tanstack/react-router";
import { AlertOctagon, Copy, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ErrorState({
  code = "500",
  title = "Something broke on our side",
  description = "The request failed before we could render this view. Our team has been notified with the reference below.",
  detail,
  onRetry,
}: {
  code?: string;
  title?: string;
  description?: string;
  detail?: string;
  onRetry?: () => void;
}) {
  const reference = `TT-${(detail ?? title).length.toString(16).toUpperCase()}-${code}`;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="surface-panel w-full max-w-lg p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-destructive-soft text-destructive">
          <AlertOctagon className="size-6" />
        </span>
        <p className="mt-5 font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
          Error {code}
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
        {detail && (
          <pre className="mt-5 max-h-32 overflow-auto rounded-lg border border-border bg-muted/60 p-3 text-left font-mono text-[11px] leading-relaxed text-muted-foreground">
            {detail}
          </pre>
        )}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {onRetry && (
            <Button onClick={onRetry}>
              <RotateCcw /> Try again
            </Button>
          )}
          <Button asChild variant="outline">
            <Link to="/">
              <Home /> Go home
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              void navigator.clipboard?.writeText(`${reference}\n${detail ?? title}`);
              toast.success("Error reference copied");
            }}
          >
            <Copy /> Copy reference
          </Button>
        </div>
        <p className="mt-5 font-mono text-[11px] text-muted-foreground">Reference {reference}</p>
      </div>
    </div>
  );
}

export function AccessDenied({ roleLabel, module }: { roleLabel: string; module: string }) {
  return (
    <div className="surface-panel mx-auto w-full max-w-lg p-8 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <AlertOctagon className="size-6" />
      </span>
      <p className="mt-5 font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
        Error 403
      </p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        {roleLabel} can't open {module}
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Your role doesn't include this permission. Ask an owner to grant access, or switch role from
        the account menu while exploring the demo.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button asChild>
          <Link to="/dashboard">Go to my portal</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/roles">View role permissions</Link>
        </Button>
      </div>
    </div>
  );
}