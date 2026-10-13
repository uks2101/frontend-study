import { useState, useEffect, useEffectEvent } from 'react';
import { getCache, setCache, deleteCache, subscribe } from '../utils/queryCache';

export function useQuery({ queryKey, queryFn, staleTime = 60 * 1000, keepPreviousData = false }) {
  const key = JSON.stringify(queryKey);

  const [result, setResult] = useState(() => ({ key, data: getCache(key)?.data, error: null }));
  const [reloadCount, setReloadCount] = useState(0);

  const runQuery = useEffectEvent((signal) => queryFn({ signal }));

  useEffect(() => {
    const cached = getCache(key);
    const isFresh = cached && Date.now() - cached.updatedAt < staleTime;
    if (isFresh) return;

    const controller = new AbortController();

    runQuery(controller.signal).then((data) => {
      setCache(key, data);
      setResult({ key, data, error: null });
    }).catch((error) => {
      if (error.name === 'AbortError') return;
      setResult({ key, data: undefined, error });
    });

    return () => controller.abort();
  }, [key, staleTime, reloadCount]);

  useEffect(() => {
    return subscribe(() => {
      if (!getCache(key)) setReloadCount((count) => count + 1);
    });
  }, [key]);

  function refetch() {
    deleteCache(key);
    setResult({ key, data: undefined, error: null });
    setReloadCount((count) => count + 1);
  }

  const isCurrent = result.key === key;
  const error = isCurrent ? result.error : null;
  let data = isCurrent && result.data !== undefined ? result.data : getCache(key)?.data;
  let isPlaceholderData = false;

  if (data === undefined && !error && keepPreviousData && result.data !== undefined) {
    data = result.data;
    isPlaceholderData = true;
  }

  const status = error ? 'error' : data !== undefined ? 'success' : 'pending';

  return { status, data, error, isPlaceholderData, refetch };
}