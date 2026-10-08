import { useInfiniteQuery } from './useInfiniteQuery';
import { getProducts } from '../api/products';

export function useProducts(filters) {
  return useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: ({ pageParam, signal }) => getProducts(filters, { page: pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
    keepPreviousData: true
  });
}