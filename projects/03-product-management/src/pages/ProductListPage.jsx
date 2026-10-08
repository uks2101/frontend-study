import { useProductFilters } from '../hooks/useProductFilters';
import { useProducts } from '../hooks/useProducts';
import { hasActiveFilters } from '../utils/productFilters';
import FilterPanel from '../components/filter/FilterPanel';
import SearchBar from '../components/filter/SearchBar';
import SortSelect from '../components/filter/SortSelect';
import ProductList from '../components/product/ProductList';
import ProductListSkeleton from '../components/product/ProductListSkeleton';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

export default function ProductListPage() {
  const { filters, setSearch, toggleCategory, setPriceRange, setSort, resetFilters } = useProductFilters();
  const { status, data, error, isPlaceholderData, refetch } = useProducts(filters);

  function renderContent() {
    if (status === 'pending') {
      return <ProductListSkeleton />;
    }

    if (status === 'error') {
      return <ErrorState message={error.message} onRetry={refetch} />;
    }

    if (data.products.length === 0) {
      return hasActiveFilters(filters) ? (
        <EmptyState title="조건에 맞는 상품이 없습니다." description="검색어나 필터를 바꿔보세요.">
          <button type='button' className="btn" onClick={resetFilters}>필터 초기화</button>
        </EmptyState>
      ) : (
        <EmptyState title="등록된 상품이 없습니다." description="잠시 후 다시 확인해주세요." />
      );
    }

    return (
      <div className={isPlaceholderData ? 'is-stale' : undefined} aria-busy={isPlaceholderData}>
        <ProductList products={data.products} />
      </div>
    );
  }

  return (
    <section className="product-page">
      <h1 className="page-title">상품 목록</h1>
      
      <div className="product-page__layout">
        <FilterPanel
          filters={filters}
          onToggleCategory={toggleCategory}
          onApplyPrice={setPriceRange}
          onReset={resetFilters}
        />

        <div className="product-page__content">
          <div className="product-toolbar">
            <SearchBar value={filters.q} onSearch={setSearch} />
            <p className="product-toolbar__count">
              {status === 'success' && `총 ${data.total}개`}
            </p>
            <SortSelect value={filters.sort} onChange={setSort} />
          </div>

          {renderContent()}
        </div>
      </div>
    </section>
  )
}