import { SORT_OPTIONS } from '../../utils/productFilters';

export default function SortSelect({ value, onChange }) {
  return (
    <div className="sort-select">
      <label htmlFor="product-sort" className="sr-only">
        정렬
      </label>
      <select id="product-sort" value={value} onChange={(e) => onChange(e.target.value)}>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
