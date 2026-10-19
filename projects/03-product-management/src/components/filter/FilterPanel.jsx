import CategoryFilter from './CategoryFilter';
import PriceFilter from './PriceFilter';

export default function FilterPanel({ filters, onToggleCategory, onApplyPrice, onReset, showHeader = true }) {
  return (
    <aside className="filter-panel" aria-label="상품 필터">
      {showHeader && (
        <div className="filter-panel__header">
          <h2 className="filter-panel__title">필터</h2>
          <button
            type="button"
            className="filter-panel__reset"
            onClick={onReset}
          >
            초기화
          </button>
        </div>
      )}

      <CategoryFilter
        selected={filters.categories}
        onToggle={onToggleCategory}
      />
      <PriceFilter
        key={`${filters.minPrice}-${filters.maxPrice}`}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onApply={onApplyPrice}
      />
    </aside>
  );
}