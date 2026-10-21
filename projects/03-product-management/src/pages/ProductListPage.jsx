import { useState } from 'react';
import { useProductFilters } from '../hooks/useProductFilters';
import { useProducts } from '../hooks/useProducts';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { hasActiveFilters } from '../utils/productFilters';
import FilterPanel from '../components/filter/FilterPanel';
import SearchBar from '../components/filter/SearchBar';
import SortSelect from '../components/filter/SortSelect';
import ProductList from '../components/product/ProductList';
import ProductListSkeleton from '../components/product/ProductListSkeleton';
import ViewToggle from '../components/product/ViewToggle';
import LoadMore from '../components/product/LoadMore';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import Drawer from '../components/common/Drawer';

export default function ProductListPage() {
  const { filters, setSearch, toggleCategory, setPriceRange, setSort, resetFilters } = useProductFilters();
  const { 
    status,
    data,
    error,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
    refetch
  } = useProducts(filters);
  const [view, setView] = useLocalStorageState('product-view', 'grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const products = data?.pages.flatMap((page) => page.products) ?? [];
  const total = data?.pages[0].total ?? 0;
  const activeFilterCount = filters.categories.length + (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0);

  function renderContent() {
    if (status === 'pending') {
      return <ProductListSkeleton view={view} />;
    }

    if (status === 'error' && !data) {
      return <ErrorState message={error.message} onRetry={refetch} />;
    }

    if (products.length === 0) {
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
        <ProductList products={products} view={view} />
        {!isPlaceholderData && (
          <LoadMore
            hasNextPage={hasNextPage}
            isFetching={isFetchingNextPage}
            error={isFetchNextPageError ? error : null}
            onLoadMore={fetchNextPage}
          />
        )}
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
            <button
              type='button'
              className="btn filter-toggle"
              onClick={() => setIsFilterOpen(true)}
            >
              필터
              {activeFilterCount > 0 && (
                <span className="badge">
                  {activeFilterCount}
                  <span className="sr-only">개 적용됨</span>
                </span>
              )}
            </button>
            <p className="product-toolbar__count">
              {status === 'success' && `${products.length} / 총 ${total}개`}
            </p>
            <SortSelect value={filters.sort} onChange={setSort} />
            <ViewToggle value={view} onChange={setView} />
          </div>

          {renderContent()}
        </div>
      </div>

      <Drawer
        open={isFilterOpen}
        title="필터"
        onClose={() => setIsFilterOpen(false)}
        footer={
          <>
            <button type='button' className="btn" onClick={resetFilters}>초기화</button>
            <button type='button' className="btn btn--primary" onClick={() => setIsFilterOpen(false)}>
              {status === 'success' ? `${total}개 상품 보기` : '결과 보기'}
            </button>
          </>
        }
      >
        <FilterPanel
          filters={filters}
          onToggleCategory={toggleCategory}
          onApplyPrice={setPriceRange}
          onReset={resetFilters}
          showHeader={false}
        />
      </Drawer>
    </section>
  )
}