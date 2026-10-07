import seed from './data/products.json';

export const db = {
  products: structuredClone(seed)
}