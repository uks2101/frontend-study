import { request } from './client';

export function getProducts() {
  return request('/api/products');
}

export function getProduct(id) {
  return request(`/api/products/${id}`);
}