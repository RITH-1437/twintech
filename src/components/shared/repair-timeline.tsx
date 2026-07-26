import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineStep = { label: string; at: string; note: string; done: boolean; active?: boolean };

export function RepairTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative space-y-0">
      {steps.map((step, i) => (
        <li key={step.label} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-8 left-[15px] h-[calc(100%-1rem)] w-0.5",
                step.done ? "bg-success" : "bg-border",
              )}
            />
          )}
          <span
            className={cn(
              "z-10 grid size-8 shrink-0 place-items-center rounded-full border-2",
              step.done
                ? "border-success bg-success text-success-foreground"
                : step.active
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-card text-muted-foreground",
            )}
          >
            {step.done ? (
              <Check className="size-4" />
            ) : step.active ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <span className="size-1.5 rounded-full bg-current" />
            )}
          </span>
          <div className="min-w-0 pt-1">
            <div className="flex flex-wrap items-center gap-x-3">
              <h3
                className={cn(
                  "text-sm font-semibold",
                  step.done || step.active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </h3>
              <span className="text-xs text-muted-foreground">{step.at}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.note}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
