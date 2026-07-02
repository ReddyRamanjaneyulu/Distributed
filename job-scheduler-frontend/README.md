# Cadence — Job Scheduler Dashboard (frontend)

A Vite + React + Tailwind dashboard for the distributed job scheduling
platform: queue health, job explorer, worker fleet, execution logs, retries
and dead-letter management.

## Stack
- **Vite** + **React 19** (JS, not TS — see note below if your repo uses `.tsx`)
- **Tailwind CSS 3** with a custom dark "control room" theme (see `tailwind.config.js`)
- **react-router-dom** (hash routing, so it works from a static file:// or any base path)
- **recharts** for the throughput chart
- **lucide-react** for icons

## Run it
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

No backend is required to explore the UI. `src/lib/engine.js` runs an
in-memory simulation of the scheduler (workers claiming jobs, retries with
backoff, heartbeats, occasional failures) so every screen has live, moving
data out of the box.

## Connecting to your real API

Every page imports only from `src/lib/api.js`. That file's function names and
return shapes already mirror the REST endpoints in the design doc
(`GET /projects`, `GET /queues`, `POST /jobs`, `POST /jobs/:id/retry`, etc).
To go live:

1. Replace the bodies in `src/lib/api.js` with `fetch()` calls to your API
   (base URL via `import.meta.env.VITE_API_URL`).
2. Delete/ignore `src/lib/engine.js` — it's only the mock backend.
3. Everything else (pages, drawers, modals, polling hook) is unchanged.

Live updates currently use polling (`src/lib/usePoll.js`, ~1.2–2s interval).
If your API exposes a WebSocket/SSE stream, swap the `setTimeout` loop in
that hook for a subscription — the hook's public shape
(`{ data, loading, error, refresh }`) doesn't need to change.

## Structure
```
src/
  lib/
    engine.js       mock backend: entities + lifecycle simulation
    api.js           REST-shaped client (swap this for real fetch calls)
    AppContext.jsx    selected project + current user
    usePoll.js        polling hook for live data
    utils.js          formatting helpers
  components/
    ui/               Badge, Panel, Button, Modal, Drawer, Input… primitives
    Sidebar.jsx, Topbar.jsx, Layout.jsx
    PulseStrip.jsx    live heartbeat/throughput waveform (the topbar signature visual)
    CreateJobModal.jsx, CreateQueueModal.jsx
    QueueDrawer.jsx, JobDrawer.jsx
  pages/
    Overview.jsx      stats, throughput chart, queue health, recent dead letters
    Queues.jsx         queue list, pause/resume, priority & retry config
    Jobs.jsx            job explorer: filter by status/type/queue, search, paginate
    Workers.jsx          worker fleet: heartbeats, slots, current jobs
    Dlq.jsx               dead letter queue: inspect + requeue
    Projects.jsx           project switcher / creation
```

## Note on this monorepo
If you're dropping this into an existing monorepo with an `apps/web` (or a
top-level `frontend/`) convention using TypeScript (`.tsx`), the fastest path
is:
1. Copy `src/` into your existing app's `src/`, renaming `.jsx` → `.tsx` as
   you go (the code is plain React with no PropTypes, so this is mostly a
   file-extension exercise — add types incrementally).
2. Merge `tailwind.config.js`'s `theme.extend` into your existing config.
3. Copy the Google Fonts `@import` in `index.css` into your existing global
   stylesheet.
4. Add the dependencies listed in `package.json` (`react-router-dom`,
   `recharts`, `lucide-react`, `clsx`).

## Design
Dark "control room" theme: near-black slate background, teal (`#22D3C7`)
as the single live/pulse accent, blue for informational states, amber for
retry/warning, coral for failure, violet for dead-letter. Space Grotesk for
headings, Inter for body copy, IBM Plex Mono for all data/timestamps/ids —
the monospace figures are meant to feel like telemetry, not prose. The one
signature element is the animated heartbeat strip under the topbar, built
from real throughput data, referencing the worker-heartbeat concept at the
core of the system.
