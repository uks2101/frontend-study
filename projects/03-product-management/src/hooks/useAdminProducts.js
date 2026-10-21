import { useSearchParams } from 'react-router';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { getProducts, deleteProduct, deleteProducts, createProduct, updateProduct } from '../api/products';

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
    placeholderData: keepPreviousData
  });
}

const ADMIN_LIST_KEY = ['products', 'admin'];

function invalidateProductQueries(client) {
  client.invalidateQueries({ queryKey: ['products'] });
  client.invalidateQueries({ queryKey: ['product'] });
}

export function useDeleteProducts() {
  return useMutation({
    mutationFn: (ids) => (ids.length === 1 ? deleteProduct(ids[0]) : deleteProducts(ids)),
    onMutate: async (ids, { client }) => {
      await client.cancelQueries({ queryKey: ADMIN_LIST_KEY });

      const snapshot = client.getQueriesData({ queryKey: ADMIN_LIST_KEY });
      client.setQueriesData({ queryKey: ADMIN_LIST_KEY }, (data) => {
        if (!data) return data;
        const products = data.products.filter((p) => !ids.includes(p.id));
        return { ...data, products, total: data.total - (data.products.length - products.length) };
      });
      return { snapshot };
    },
    onError: (_error, _ids, onMutateResult, { client }) => {
      onMutateResult?.snapshot.forEach(([queryKey, data]) => client.setQueryData(queryKey, data));
    },
    onSettled: (_data, _error, _ids, _onMutateResult, { client }) => invalidateProductQueries(client)
  });
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: (data) => createProduct(data),
    onSuccess: (_data, _variables, _onMutateResult, { client }) => invalidateProductQueries(client)
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: (_data, _variables, _onMutateResult, { client }) => invalidateProductQueries(client)
  });
}

function setStockInCache(client, id, nextStock, expectedStock) {
  client.setQueriesData({ queryKey: ADMIN_LIST_KEY }, (data) => {
    if (!data) return data;
    return {
      ...data,
      products: data.products.map((p) =>
        p.id === id && (expectedStock === undefined || p.stock === expectedStock) ? { ...p, stock: nextStock } : p,
      ),
    };
  });
}

export function useUpdateStock() {
  return useMutation({
    mutationFn: ({ id, stock }) => updateProduct(id, { stock }),
    onMutate: async ({ id, stock, previousStock }, { client }) => {
      await client.cancelQueries({ queryKey: ADMIN_LIST_KEY });
      setStockInCache(client, id, stock);
      return { previousStock };
    },
    onError: (_error, { id, stock }, onMutateResult, { client }) => {
      if (onMutateResult) setStockInCache(client, id, onMutateResult.previousStock, stock);
    },
    onSettled: (_data, _error, _variables, _onMutateResult, { client }) => invalidateProductQueries(client)
  });
}