import { useEffect, useMemo, useReducer } from 'react';
import { cartReducer } from './cartReducer';
import { CART_STORAGE_KEY, loadCart, saveCart } from './cartStorage';
import { CartStateContext, CartActionsContext } from './cartContext';

export default function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    saveCart(state);
  }, [state]);

  useEffect(() => {
    function handleStorage(e) {
      if (e.key === CART_STORAGE_KEY) {
        dispatch({ type: 'REPLACE', state: loadCart() });
      }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const actions = useMemo(() => ({
    addItem: (product, quantity) => dispatch({ type: 'ADD_ITEM', product, quantity }),
    updateQuantity: (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
    restoreItem: (item, index) => dispatch({ type: 'RESTORE_ITEM', item, index }),
    removeChecked: () => dispatch({ type: 'REMOVE_CHECKED' }),
    toggleItem: (id) => dispatch({ type: 'TOGGLE_ITEM', id }),
    toggleAll: (checked) => dispatch({ type: 'TOGGLE_ALL', checked }),
  }), []);

  return (
    <CartStateContext value={state}>
      <CartActionsContext value={actions}>{children}</CartActionsContext>
    </CartStateContext>
  )
}