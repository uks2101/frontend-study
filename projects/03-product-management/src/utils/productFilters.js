export const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'price-asc', label: '낮은 가격순' },
  { value: 'price-desc', label: '높은 가격순' },
  { value: 'rating', label: '평점순' },
];

export const DEFAULT_SORT = 'latest';

const SORT_VALUES = SORT_OPTIONS.map((option) => option.value);

function toPrice(value) {
  if (value === null || value.trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function parseFilters(searchParams) {
  const sort = searchParams.get('sort');

  return {
    q: searchParams.get('q') ?? '',
    categories: searchParams.getAll('category'),
    minPrice: toPrice(searchParams.get('minPrice')),
    maxPrice: toPrice(searchParams.get('maxPrice')),
    sort: SORT_VALUES.includes(sort) ? sort : DEFAULT_SORT,
  };
}

export function hasActiveFilters(filters) {
  return (
    filters.q.trim() !== '' ||
    filters.categories.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null
  );
}

export function toSearchParams(filters) {
  const params = new URLSearchParams();

  if (filters.q.trim()) params.set('q', filters.q);
  filters.categories.forEach((category) => params.append('category', category));
  if (filters.minPrice !== null) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice !== null) params.set('maxPrice', filters.maxPrice);
  if (filters.sort !== DEFAULT_SORT) params.set('sort', filters.sort);

  return params;
}
