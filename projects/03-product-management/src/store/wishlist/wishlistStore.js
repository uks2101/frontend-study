import { createStore, persistStore, useStore } from '../createStore';
import { toProductSnapshot } from '../../utils/productSnapshot';

const wishlistStore = createStore({ items: [] });
persistStore(wishlistStore, 'wishlist', (saved) => Array.isArray(saved?.items));

export function toggleWishlist(product) {
  wishlistStore.setState((state) => {
    const exists = state.items.some((item) => item.id === product.id);
    return {
      items: exists
        ? state.items.filter((item) => item.id !== product.id)
        : [toProductSnapshot(product), ...state.items],
    };
  });
}

export function useWishlistItems() {
  return useStore(wishlistStore, (state) => state.items);
}

export function useWishlistCount() {
  return useStore(wishlistStore, (state) => state.items.length);
}

export function useIsWishlisted(id) {
  return useStore(wishlistStore, (state) => state.items.some((item) => item.id === id));
}