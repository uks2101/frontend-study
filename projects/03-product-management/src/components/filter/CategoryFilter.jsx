import { useCategories } from '../../hooks/useCategories';

export default function CategoryFilter({ selected, onToggle }) {
  const { status, data: categories } = useCategories();

  return (
    <fieldset className="filter-group">
      <legend className="filter-group__title">카테고리</legend>

      {status === 'pending' && <p className="filter-group__message">불러오는 중...</p>}
      {status === 'error' && <p className="filter-group__message">카테고리를 불러오지 못했습니다.</p>}

      {status === 'success' && (
        <ul className="category-list">
          {categories.map(({ slug, count }) => (
            <li key={slug}>
              <label className="category-list__item">
                <input type="checkbox" checked={selected.includes(slug)} onChange={() => onToggle(slug)} />
                <span className="category-list__name">{slug.replaceAll('-', ' ')}</span>
                <span className="category-list__count">{count}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  )
}