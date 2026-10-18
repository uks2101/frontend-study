export function toProductSnapshot(product) {
  const { id, title, brand, description, thumbnail, price, discountPercentage, rating } = product;
  return { id, title, brand, description, thumbnail, price, discountPercentage, rating };
}