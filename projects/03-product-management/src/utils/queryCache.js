const cache = new Map();

export function getCache(key) {
  return cache.get(key);
}

export function setCache(key, data) {
  cache.set(key, { data, updatedAt: Date.now() });
}

export function deleteCache(key) {
  cache.delete(key);
}