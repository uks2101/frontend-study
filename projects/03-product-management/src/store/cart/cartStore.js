import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartReducer, initialCartState } from './cartReducer';
import { syncTabs } from '../syncTabs';

export const useCartStore = create(
  persist(
    (set) => {
      const dispatch = (action) => set((state) => cartReducer(state, action));

      return {
        ...initialCartState,
        addItem: (product, quantity) => dispatch({ type: 'ADD_ITEM', product, quantity }),
        updateQuantity: (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity }),
        removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
        restoreItem: (item, index) => dispatch({ type: 'RESTORE_ITEM', item, index }),
        removeChecked: () => dispatch({ type: 'REMOVE_CHECKED' }),
        toggleItem: (id) => dispatch({ type: 'TOGGLE_ITEM', id }),
        toggleAll: (checked) => dispatch({ type: 'TOGGLE_ALL', checked }),
      };
    },
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

syncTabs(useCartStore);
