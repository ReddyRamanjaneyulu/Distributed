import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-xl space-y-4">
      <div className="panel p-5">
        <h3 className="mb-4 font-display text-sm font-semibold text-ink">Account</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-faint">Name</dt>
            <dd className="text-ink">{user?.name ?? '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-faint">Email</dt>
            <dd className="text-ink">{user?.email}</dd>
          </div>
        </dl>
      </div>

      <div className="panel p-5">
        <h3 className="mb-4 font-display text-sm font-semibold text-ink">API</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-faint">Base URL</dt>
            <dd className="font-mono text-xs text-ink">{import.meta.env.VITE_API_BASE_URL}</dd>
          </div>
        </dl>
      </div>

      <div className="panel p-5">
        <h3 className="mb-2 font-display text-sm font-semibold text-danger">Danger Zone</h3>
        <p className="mb-4 text-sm text-ink-muted">Sign out of your account on this device.</p>
        <button onClick={logout} className="btn-danger">
          Log out
        </button>
      </div>
    </div>
  );
}
