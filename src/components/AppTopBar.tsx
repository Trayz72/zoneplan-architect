import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function AppTopBar({
  title,
  subtitle,
  right,
  showBack = true,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  showBack?: boolean;
}) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-card px-3">
      {showBack ? (
        <Link
          to="/projects"
          className="flex items-center gap-1.5 rounded-sm border border-border px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </Link>
      ) : null}
      <div className="min-w-0">
        <div className="truncate text-[13px] font-medium text-foreground">{title}</div>
        {subtitle ? <div className="truncate text-[11px] text-muted-foreground">{subtitle}</div> : null}
      </div>
      <div className="ml-auto flex items-center gap-2">{right}</div>
    </header>
  );
}
