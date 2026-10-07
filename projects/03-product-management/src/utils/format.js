const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatPrice(value) {
  return priceFormatter.format(value);
}

export function getSalePrice(price, discountPercentage) {
  return Math.round(price * (100 - discountPercentage)) / 100;
}