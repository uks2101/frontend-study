export const initialCartState = { items: [] };

function toCartItem(product, quantity) {
  const { id, title, brand, thumbnail, price, discountPercentage, stock } = product;
  return { id, title, brand, thumbnail, price, discountPercentage, stock, quantity, checked: true };
}

function clampQuantity(quantity, stock) {
  return Math.min(Math.max(quantity, 1), stock);
}

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action;
      const exists = state.items.some((item) => item.id === product.id);

      if (!exists) {
        return { ...state, items: [...state.items, toCartItem(product, clampQuantity(quantity, product.stock))] };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === product.id
            ? { ...item, stock: product.stock, quantity: clampQuantity(item.quantity + quantity, product.stock) }
            : item
        )
      };
    }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity: clampQuantity(action.quantity, item.stock) } : item,
        )
      };

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };

    case 'RESTORE_ITEM': {
      if (state.items.some((item) => item.id === action.item.id)) return state;
      const items = [...state.items];
      items.splice(action.index, 0, action.item);
      return { ...state, items };
    };

    case 'REMOVE_CHECKED':
      return { ...state, items: state.items.filter((item) => !item.checked) };

    case 'TOGGLE_ITEM':
      return {
        ...state,
        items: state.items.map((item) => (item.id === action.id ? { ...item, checked: !item.checked } : item))
      };

    case 'TOGGLE_ALL':
      return { ...state, items: state.items.map((item) => ({ ...item, checked: action.checked })) };

    case 'REPLACE':
      return action.state;

    default:
      throw new Error(`알 수 없는 장바구니 액션: ${action.type}`);
  }
}