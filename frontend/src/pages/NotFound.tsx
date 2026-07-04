import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <p className="font-display text-5xl font-bold text-ink-faint">404</p>
      <p className="text-ink-muted">This page doesn't exist.</p>
      <Link to="/" className="btn-secondary mt-2">
        Back to Dashboard
      </Link>
    </div>
  );
}
