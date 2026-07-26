import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Brand({ className, to = "/" }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn("group flex items-center gap-2.5", className)} aria-label="TwinTech home">
      <span className="gradient-primary grid size-9 shrink-0 place-items-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path d="M4 7.5h6.5v9H4z" fill="white" fillOpacity="0.95" />
          <path d="M13.5 7.5H20v9h-6.5z" fill="white" fillOpacity="0.6" />
        </svg>
      </span>
      <span className="text-[1.05rem] font-semibold tracking-tight text-foreground">
        Twin<span className="text-primary">Tech</span>
      </span>
    </Link>
  );
}
