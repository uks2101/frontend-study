import { initialCartState } from './cartReducer';

export const CART_STORAGE_KEY = 'cart';

export function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    return Array.isArray(saved?.items) ? saved : initialCartState;
  } catch {
    return initialCartState;
  }
}

export function saveCart(state) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    //저장 실패해도 현재 화면의 장바구니는 정상 동작
  }
}