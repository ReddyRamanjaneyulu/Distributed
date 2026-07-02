import { cn } from "../../lib/utils";

const MAP = {
  queued: "bg-accent/10 text-accent border-accent/30",
  scheduled: "bg-ink-faint/10 text-ink-dim border-border-light",
  claimed: "bg-warning/10 text-warning border-warning/30",
  running: "bg-pulse/10 text-pulse border-pulse/30",
  retrying: "bg-warning/10 text-warning border-warning/30",
  completed: "bg-success/10 text-success border-success/30",
  failed: "bg-danger/10 text-danger border-danger/30",
  dead: "bg-dlq/10 text-dlq border-dlq/30",
  paused: "bg-ink-faint/10 text-ink-dim border-border-light",
  active: "bg-success/10 text-success border-success/30",
  idle: "bg-accent/10 text-accent border-accent/30",
  busy: "bg-pulse/10 text-pulse border-pulse/30",
  offline: "bg-danger/10 text-danger border-danger/30",
};

const DOT = {
  queued: "bg-accent",
  scheduled: "bg-ink-faint",
  claimed: "bg-warning",
  running: "bg-pulse animate-blink",
  retrying: "bg-warning animate-blink",
  completed: "bg-success",
  failed: "bg-danger",
  dead: "bg-dlq",
  paused: "bg-ink-faint",
  active: "bg-success",
  idle: "bg-accent",
  busy: "bg-pulse animate-blink",
  offline: "bg-danger",
};

export default function Badge({ status, label, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-mono font-medium capitalize",
        MAP[status] || "bg-surface-2 text-ink-dim border-border-light",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT[status] || "bg-ink-faint")} />
      {label || status}
    </span>
  );
}
