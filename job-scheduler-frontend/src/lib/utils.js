import clsx from "clsx";

export function cn(...args) {
  return clsx(...args);
}

export function timeAgo(ts) {
  if (!ts) return "—";
  const diff = Date.now() - ts;
  if (diff < 1000) return "just now";
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function formatDuration(ms) {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  const rem = Math.round(s % 60);
  return `${m}m ${rem}s`;
}

export function formatDateTime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString([], {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export function shortId(id) {
  if (!id) return "";
  return id.length > 14 ? `${id.slice(0, 10)}…` : id;
}
