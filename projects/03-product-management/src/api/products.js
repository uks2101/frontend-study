import { request } from './client';
import { toSearchParams } from '../utils/productFilters';

export const PAGE_SIZE = 20;

export function getProducts(filters, { page = 1, limit = PAGE_SIZE, signal } = {}) {
  const params = toSearchParams(filters);
  params.set('page', page);
  params.set('limit', limit);
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

export function deleteProduct(id) {
  return request(`/api/products/${id}`, { method: 'DELETE' });
}

export function deleteProducts(ids) {
  return request('/api/products/bulk-delete', { method: 'POST', body: { ids } });
}

export function createProduct(data) {
  return request('/api/products', { method: 'POST', body: data });
}

export function updateProduct(id, data) {
  return request(`/api/products/${id}`, { method: 'PATCH', body: data });
}
