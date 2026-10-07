import { useQuery } from './useQuery';
import { getProducts } from '../api/products';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: ({ signal }) => getProducts({ signal })
  });
}