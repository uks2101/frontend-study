import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toProductSnapshot } from '../../utils/productSnapshot';
import { syncTabs } from '../syncTabs';

const useWishlistStore = create(
  persist(() => ({ items: [] }), { name: 'wishlist-storage' }),
);

syncTabs(useWishlistStore);

export function toggleWishlist(product) {
  useWishlistStore.setState((state) => {
    const exists = state.items.some((item) => item.id === product.id);
    return {
      items: exists
        ? state.items.filter((item) => item.id !== product.id)
        : [toProductSnapshot(product), ...state.items],
    };
  });
}

export function useWishlistItems() {
  return useWishlistStore((state) => state.items);
}

export function useWishlistCount() {
  return useWishlistStore((state) => state.items.length);
}

export function useIsWishlisted(id) {
  return useWishlistStore((state) => state.items.some((item) => item.id === id));
}