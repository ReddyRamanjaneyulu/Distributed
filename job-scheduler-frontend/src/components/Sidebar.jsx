import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListTree, ListChecks, Cpu, Skull, FolderKanban, Radio } from "lucide-react";
import { cn } from "../lib/utils";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/queues", label: "Queues", icon: ListTree },
  { to: "/jobs", label: "Job Explorer", icon: ListChecks },
  { to: "/workers", label: "Workers", icon: Cpu },
  { to: "/dlq", label: "Dead Letter Queue", icon: Skull },
  { to: "/projects", label: "Projects", icon: FolderKanban },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-surface/60">
      <div className="flex items-center gap-2 border-b border-border px-5 py-5">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-pulse/10 border border-pulse/30">
          <Radio className="h-4 w-4 text-pulse" strokeWidth={2} />
        </div>
        <div>
          <div className="font-display text-sm font-bold leading-tight text-ink">Cadence</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">job scheduler</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-ink-dim hover:bg-surface-hover hover:text-ink border border-transparent"
              )
            }
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-2 text-xs text-ink-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-blink" />
          Engine simulation running
        </div>
      </div>
    </aside>
  );
}
