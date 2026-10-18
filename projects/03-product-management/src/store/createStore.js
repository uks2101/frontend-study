import { useSyncExternalStore } from 'react';

export function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => state,
    setState: (updater) => {
      const next = typeof updater === 'function' ? updater(state) : updater;
      if (next === state) return;
      state = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}

export function useStore(store, selector) {
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()));
}

export function persistStore(store, key, isValid) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (isValid(saved)) store.setState(saved);
  } catch {
    // 저장된 값이 없거나 깨졌으면 초기값 사용
  }

  store.subscribe(() => {
    try {
      localStorage.setItem(key, JSON.stringify(store.getState()));
    } catch {
      // 저장 실패해도 화면은 정상 동작
    }
  });

  window.addEventListener('storage', (e) => {
    if (e.key !== key) return;
    try {
      const saved = JSON.parse(e.newValue);
      if (isValid(saved)) store.setState(saved);
    } catch {
      // 무시
    }
  });
}