import { useQuery, useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { getProducts, getProduct, getRelatedProducts } from '../api/products';

export function useProducts(filters) {
  return useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: ({ pageParam, signal }) => getProducts(filters, { page: pageParam, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: ({ signal }) => getProduct(id, { signal }),
  });
}

export function useRelatedProducts(id) {
  return useQuery({
    queryKey: ['product', id, 'related'],
    queryFn: ({ signal }) => getRelatedProducts(id, { signal }),
    staleTime: 5 * 60 * 1000,
  });
}
