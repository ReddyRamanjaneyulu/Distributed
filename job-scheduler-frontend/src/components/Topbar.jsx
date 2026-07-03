import { ChevronDown } from "lucide-react";
import { useApp } from "../lib/AppContext";
import { usePoll } from "../lib/usePoll";
import { getOverview } from "../lib/api";
import PulseStrip from "./PulseStrip";
import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/auth";
export default function Topbar({ title, subtitle, actions }) {
  const { project, projects, setProjectId } = useApp();
  const [open, setOpen] = useState(false);
  const { data } = usePoll(() => getOverview({ projectId: project?.id }), [project?.id], 1500);
  const isAuthenticated = authService.isAuthenticated();
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
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border-light bg-surface-2 px-3 py-1.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-ink">
                    {user?.email?.split("@")[0]}
                  </span>

                  <span className="text-[11px] text-ink-dim">
                    {user?.email}
                  </span>
                </div>
              </div>

              <button
                onClick={() => authService.logout()}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg border border-border-light bg-surface-2 px-4 py-2 text-sm text-ink hover:bg-surface-hover"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          )}
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