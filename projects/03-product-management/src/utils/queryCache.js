const cache = new Map();
const listeners = new Set();

function matches(key, queryKey) {
  const exact = JSON.stringify(queryKey);
  return key === exact || key.startsWith(exact.slice(0, -1) + ',');
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function getCache(key) {
  return cache.get(key);
}

export function setCache(key, data) {
  cache.set(key, { data, updatedAt: Date.now() });
}

export function deleteCache(key) {
  cache.delete(key);
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function invalidateQueries(queryKey) {
  for (const key of cache.keys()) {
    if (matches(key, queryKey)) cache.delete(key);
  }
  notify();
}

export function getQueriesData(queryKey) {
  return [...cache.entries()]
    .filter(([key]) => matches(key, queryKey))
    .map(([key, entry]) => [key, entry.data]);
}

export function setQueriesData(queryKey, updater) {
  for (const [key, entry] of cache.entries()) {
    if (matches(key, queryKey)) {
      cache.set(key, { ...entry, data: updater(entry.data) });
    }
  }
  notify();
}

export function restoreQueriesData(snapshot) {
  snapshot.forEach(([key, data]) => {
    const entry = cache.get(key);
    if (entry) cache.set(key, { ...entry, data });
  });
  notify();
}