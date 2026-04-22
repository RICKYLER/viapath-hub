import type { ReactNode } from "react";

interface DashboardShellProps {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
}

export function DashboardShell({ eyebrow, title, description, aside, children }: DashboardShellProps) {
  return (
    <section className="page-shell section-gap space-y-6 sm:space-y-8">
      <header className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
        <div className="space-y-3">
          <span className="eyebrow">{eyebrow}</span>
          <div className="space-y-2">
            <h1 className="title-section text-balance">{title}</h1>
            <p className="body-copy max-w-2xl">{description}</p>
          </div>
        </div>
        {aside ? <div className="surface-panel p-4">{aside}</div> : null}
      </header>
      {children}
    </section>
  );
}
