import { createContext, useContext } from 'react';

export const CartStateContext = createContext(null);
export const CartActionsContext = createContext(null);

export function useCart() {
  const state = useContext(CartStateContext);
  if (state === null) throw new Error('useCart는 CartProvider 안에서만 사용할 수 있습니다.');
  return state;
}

export function useCartActions() {
  const actions = useContext(CartActionsContext);
  if (actions === null) throw new Error('useCartActions는 CartProvider 안에서만 사용할 수 있습니다.');
  return actions;
}