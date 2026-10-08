import { request } from './client';
import { toSearchParams } from '../utils/productFilters';

export function getProducts(filters, { signal } = {}) {
  const query = toSearchParams(filters).toString();
  return request(query ? `/api/products?${query}` : '/api/products', { signal });
}

export function getProduct(id, { signal } = {}) {
  return request(`/api/products/${id}`, { signal });
}

export function getCategories({ signal } = {}) {
  return request('/api/categories', { signal });
}