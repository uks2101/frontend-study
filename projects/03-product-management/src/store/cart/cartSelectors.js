import { getSalePrice } from '../../utils/format';

export const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_FEE = 5;

export function getCartSummary(items) {
  const checkedItems = items.filter((item) => item.checked);

  const originalPrice = checkedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const salePrice = checkedItems.reduce(
    (sum, item) => sum + getSalePrice(item.price, item.discountPercentage) * item.quantity,
    0,
  );
  const shipping =
    checkedItems.length === 0 || salePrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return {
    checkedCount: checkedItems.length,
    originalPrice,
    discount: originalPrice - salePrice,
    shipping,
    total: salePrice + shipping,
    remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - salePrice),
  };
}
