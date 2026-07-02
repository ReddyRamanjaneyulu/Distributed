import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Polls an async fetcher on an interval, exposing {data, loading, error, refresh}.
 * Live updates in this app are implemented via polling (see design decisions doc
 * for the polling-vs-websocket trade-off); swapping to a WebSocket push later
 * only requires changing this hook.
 */
export function usePoll(fetcher, deps = [], intervalMs = 1500) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refresh = useCallback(async () => {
    try {
      const result = await fetcherRef.current();
      setData(result);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer = null;
    setLoading(true);

    async function loop() {
      if (cancelled) return;
      try {
        const result = await fetcherRef.current();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
      timer = setTimeout(loop, intervalMs);
    }
    loop();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refresh };
}
