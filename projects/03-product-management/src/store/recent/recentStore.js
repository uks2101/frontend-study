import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toProductSnapshot } from '../../utils/productSnapshot';
import { syncTabs } from '../syncTabs';

const MAX_RECENT = 10;

const useRecentStore = create(persist(() => ({ items: [] }), { name: 'recent-storage' }));

syncTabs(useRecentStore);

export function addRecentlyViewed(product) {
  useRecentStore.setState((state) => {
    if (state.items[0]?.id === product.id) return state;
    const others = state.items.filter((item) => item.id !== product.id);
    return { items: [toProductSnapshot(product), ...others].slice(0, MAX_RECENT) };
  });
}

export function clearRecentlyViewed() {
  useRecentStore.setState({ items: [] });
}

export function useRecentlyViewed() {
  return useRecentStore((state) => state.items);
}
