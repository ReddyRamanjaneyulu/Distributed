import { cn } from "../../lib/utils";

export function Panel({ children, className, ...props }) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface shadow-panel", className)} {...props}>
      {children}
    </div>
  );
}

export function PanelHeader({ title, subtitle, action, eyebrow }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
      <div>
        {eyebrow && <div className="mb-1 font-mono text-[11px] uppercase tracking-wider text-pulse">{eyebrow}</div>}
        <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-ink-dim">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Button({ children, variant = "primary", size = "md", className, ...props }) {
  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90 border border-accent",
    ghost: "bg-transparent text-ink-dim hover:text-ink hover:bg-surface-hover border border-transparent",
    outline: "bg-transparent text-ink hover:bg-surface-hover border border-border-light",
    danger: "bg-danger/10 text-danger hover:bg-danger/20 border border-danger/30",
    pulse: "bg-pulse text-bg hover:bg-pulse/90 border border-pulse font-semibold",
  };
  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatCard({ label, value, sub, accent = "text-ink", icon: Icon }) {
  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between">
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">{label}</div>
        {Icon && <Icon className="h-3.5 w-3.5 text-ink-faint" strokeWidth={1.75} />}
      </div>
      <div className={cn("mt-2 font-display text-2xl font-semibold tabular", accent)}>{value}</div>
      {sub && <div className="mt-1 text-xs text-ink-dim">{sub}</div>}
    </Panel>
  );
}

export function EmptyState({ title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <div className="font-display text-sm font-semibold text-ink">{title}</div>
      {subtitle && <div className="max-w-sm text-xs text-ink-dim">{subtitle}</div>}
      {action}
    </div>
  );
}

export function Input(props) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border-light bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-pulse/60 focus:ring-1 focus:ring-pulse/40",
        props.className
      )}
      {...props}
    />
  );
}

export function Select({ children, className, ...props }) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-border-light bg-surface-2 px-3 py-2 text-sm text-ink outline-none focus:border-pulse/60 focus:ring-1 focus:ring-pulse/40",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ children }) {
  return <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-ink-faint">{children}</label>;
}

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-surface-2", className)} />;
}
