import { useSearchParams } from 'react-router';
import { parseFilters, toSearchParams, DEFAULT_SORT } from '../utils/productFilters';

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseFilters(searchParams);

  function updateFilters(changes, options) {
    setSearchParams(toSearchParams({ ...filters, ...changes }), options);
  }

  function setSearch(q) {
    updateFilters({ q }, { replace: true });
  }

  function toggleCategory(category) {
    const categories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories });
  }

  function setPriceRange(minPrice, maxPrice) {
    updateFilters({ minPrice, maxPrice });
  }

  function setSort(sort) {
    updateFilters({ sort });
  }

  function resetFilters() {
    updateFilters({ q: '', categories: [], minPrice: null, maxPrice: null, sort: DEFAULT_SORT });
  }

  return { filters, setSearch, toggleCategory, setPriceRange, setSort, resetFilters };
}
