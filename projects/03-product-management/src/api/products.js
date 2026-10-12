import { request } from './client';
import { toSearchParams } from '../utils/productFilters';

export const PAGE_SIZE = 20;

export function getProducts(filters, { page = 1, signal } = {}) {
  const params = toSearchParams(filters);
  params.set('page', page);
  params.set('limit', PAGE_SIZE);
  return request(`/api/products?${params}`, { signal });
}

export function getProduct(id, { signal } = {}) {
  return request(`/api/products/${id}`, { signal });
}

export function getRelatedProducts(id, { signal } = {}) {
  return request(`/api/products/${id}/related`, { signal });
}

export function getCategories({ signal } = {}) {
  return request('/api/categories', { signal });
}