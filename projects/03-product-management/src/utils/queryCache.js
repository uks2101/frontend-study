const cache = new Map();
const listeners = new Set();

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
  const exact = JSON.stringify(queryKey);
  const prefix = exact.slice(0, -1) + ',';

  for (const key of cache.keys()) {
    if (key === exact || key.startsWith(prefix)) {
      cache.delete(key);
    }
  }

  listeners.forEach((listener) => listener());
}