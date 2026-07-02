import { ChevronDown } from "lucide-react";
import { useApp } from "../lib/AppContext";
import { usePoll } from "../lib/usePoll";
import { getOverview } from "../lib/api";
import PulseStrip from "./PulseStrip";
import { useState } from "react";

export default function Topbar({ title, subtitle, actions }) {
  const { project, projects, setProjectId } = useApp();
  const [open, setOpen] = useState(false);
  const { data } = usePoll(() => getOverview({ projectId: project?.id }), [project?.id], 1500);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-6 pt-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-lg font-semibold text-ink">{title}</h1>
          </div>
          {subtitle && <p className="mt-0.5 text-xs text-ink-dim">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3">
          {actions}

          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg border border-border-light bg-surface-2 px-3 py-1.5 text-sm text-ink hover:bg-surface-hover"
            >
              <span className="font-mono text-xs text-ink-faint">project</span>
              <span className="font-medium">{project?.name || "—"}</span>
              <ChevronDown className="h-3.5 w-3.5 text-ink-faint" />
            </button>
            {open && (
              <div className="absolute right-0 z-20 mt-1 w-56 rounded-lg border border-border-light bg-surface-2 py-1 shadow-panel">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setProjectId(p.id); setOpen(false); }}
                    className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-hover"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border-light bg-surface-2 px-3 py-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 font-mono text-[11px] font-semibold text-accent">
              AR
            </div>
            <span className="text-xs text-ink-dim">Alex Rivera</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 px-6 pb-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint whitespace-nowrap">
          throughput / 30m
        </span>
        <PulseStrip throughput={data?.throughput} height={32} />
      </div>
    </header>
  );
}
