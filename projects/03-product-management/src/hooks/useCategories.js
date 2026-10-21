import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/products';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: ({ signal }) => getCategories({ signal }),
    staleTime: 10 * 60 * 1000,
  });
}
