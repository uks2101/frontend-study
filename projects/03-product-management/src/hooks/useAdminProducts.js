import { useSearchParams } from 'react-router';
import { useQuery } from './useQuery';
import { useMutation } from './useMutation';
import { getProducts, deleteProduct, deleteProducts, createProduct, updateProduct } from '../api/products';
import { invalidateQueries } from '../utils/queryCache';

export const ADMIN_PAGE_SIZE = 10;
export const ADMIN_DEFAULT_SORT = 'created-desc';

const ADMIN_SORTS = [
  'created-desc', 'created-asc',
  'title-asc', 'title-desc',
  'price-asc', 'price-desc',
  'stock-asc', 'stock-desc',
];

export function useAdminProductParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const q = searchParams.get('q') ?? '';
  const sortParam = searchParams.get('sort');
  const sort = ADMIN_SORTS.includes(sortParam) ? sortParam : ADMIN_DEFAULT_SORT;

  function update(changes, options) {
    const next = { page, q, sort, ...changes };
    const params = new URLSearchParams();

    if (next.page > 1) params.set('page', next.page);
    if (next.q.trim()) params.set('q', next.q);
    if (next.sort !== ADMIN_DEFAULT_SORT) params.set('sort', next.sort);

    setSearchParams(params, options);
  }

  return {
    params: { page, q, sort },
    setPage: (nextPage) => update({ page: nextPage }),
    setSearch: (nextQ) => update({ q: nextQ, page: 1 }, { replace: true }),
    setSort: (nextSort) => update({ sort: nextSort, page: 1 }),
  };
}

export function useAdminProducts({ page, q, sort }) {
  return useQuery({
    queryKey: ['products', 'admin', { page, q, sort }],
    queryFn: ({ signal }) =>
      getProducts({ q, categories: [], minPrice: null, maxPrice: null, sort }, { page, limit: ADMIN_PAGE_SIZE, signal }),
    keepPreviousData: true,
  });
}

function invalidateProductQueries() {
  invalidateQueries(['products']);
  invalidateQueries(['product']);
}

export function useDeleteProducts() {
  return useMutation({
    mutationFn: (ids) => (ids.length === 1 ? deleteProduct(ids[0]) : deleteProducts(ids)),
    onSuccess: invalidateProductQueries,
  });
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: (data) => createProduct(data),
    onSuccess: invalidateProductQueries
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: invalidateProductQueries,
  });
}