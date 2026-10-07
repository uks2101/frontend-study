import { request } from './client';

export function getProducts({ signal } = {}) {
  return request('/api/products', { signal });
}

export function getProduct(id, { signal } = {}) {
  return request(`/api/products/${id}`, { signal });
}