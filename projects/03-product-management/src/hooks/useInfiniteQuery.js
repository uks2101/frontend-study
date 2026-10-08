import { useState, useEffect, useEffectEvent, useRef } from 'react';
import { getCache, setCache, deleteCache } from '../utils/queryCache';

export function useInfiniteQuery({
  queryKey,
  queryFn,
  initialPageParam,
  getNextPageParam,
  staleTime = 60 * 1000,
  keepPreviousData = false,
}) {
  const key = JSON.stringify(queryKey);

  const [result, setResult] = useState(() => ({ key, data: getCache(key)?.data, error: null }));
  const [nextPage, setNextPage] = useState({ key: null, isFetching: false, error: null });
  const [reloadCount, setReloadCount] = useState(0);
  const nextControllerRef = useRef(null);

  const runQuery = useEffectEvent((pageParam, signal) => queryFn({ pageParam, signal }));

  useEffect(() => {
    const cached = getCache(key);
    const isFresh = cached && Date.now() - cached.updateAt < staleTime;
    if (isFresh) return;

    const controller = new AbortController();
    const pageParams = cached?.data.pageParams ?? [initialPageParam];

    Promise.all(pageParams.map((pageParam) => runQuery(pageParam, controller.signal)))
    .then((pages) => {
      const data = { pages, pageParams };
      setCache(key, data);
      setResult({ key, data, error: null });
    })
    .catch((error) => {
      if (error.name === 'AbortError') return;
      setResult({ key, data: undefined, error });
    });

    return () => controller.abort();
  }, [key, staleTime, initialPageParam, reloadCount]);

  useEffect(() => {
    return () => nextControllerRef.current?.abort();
  }, [key]);

  const isCurrent = result.key === key;
  const error = isCurrent ? result.error : null;
  let data = isCurrent && result.data !== undefined ? result.data : getCache(key)?.data;
  let isPlaceholderData = false;

  if (data === undefined && !error && keepPreviousData && result.data !== undefined) {
    data = result.data;
    isPlaceholderData = true;
  }

  const status = error ? 'error' : data !== undefined ? 'success' : 'pending';

  const lastPage = data?.pages.at(-1);
  const nextPageParam = lastPage !== undefined ? getNextPageParam(lastPage) : undefined;
  const hasNextPage = !isPlaceholderData && nextPageParam !== undefined;
  const isFetchingNextPage = nextPage.key === key && nextPage.isFetching;
  const fetchNextPageError = nextPage.key === key ? nextPage.error : null;

  async function fetchNextPage() {
    if (!hasNextPage || nextControllerRef.current) return;

    const controller = new AbortController();
    nextControllerRef.current = controller;
    setNextPage({ key, isFetching: true, error: null });

    try {
      const page = await queryFn({ pageParam: nextPageParam, signal: controller.signal });
      const nextData = {
        pages: [...data.pages, page],
        pageParams: [...data.pageParams, nextPageParam],
      };
      setCache(key, nextData);
      setResult({ key, data: nextData, error: null });
      setNextPage({ key, isFetching: false, error: null });
    } catch (err) {
      if (err.name === 'AbortError') return;
      setNextPage({ key, isFetching: false, error: err });
    } finally {
      if (nextControllerRef.current === controller) {
        nextControllerRef.current = null;
      }
    }
  }

  function refetch() {
    deleteCache(key);
    setResult({ key, data: undefined, error: null });
    setReloadCount((count) => count + 1);
  }

  return {
    status,
    data,
    error,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPageError,
    fetchNextPage,
    refetch
  };
}