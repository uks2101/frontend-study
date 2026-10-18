import { createStore, persistStore, useStore } from '../createStore';
import { toProductSnapshot } from '../../utils/productSnapshot';

const MAX_RECENT = 10;

const recentStore = createStore({ items: [] });
persistStore(recentStore, 'recently-viewed', (saved) => Array.isArray(saved?.items));

export function addRecentlyViewed(product) {
  recentStore.setState((state) => {
    if (state.items[0]?.id === product.id) return state;

    const others = state.items.filter((item) => item.id !== product.id);
    return { items: [toProductSnapshot(product), ...others].slice(0, MAX_RECENT) };
  });
}

export function clearRecentlyViewed() {
  recentStore.setState({ items: [] });
}

export function useRecentlyViewed() {
  return useStore(recentStore, (state) => state.items);
}