import { useQuery } from './useQuery';
import { getProducts } from '../api/products';

export function useProducts(filters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: ({ signal }) => getProducts(filters, { signal }),
    keepPreviousData: true
  });
}