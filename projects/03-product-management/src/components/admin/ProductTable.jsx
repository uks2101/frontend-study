import { Link } from 'react-router';
import { formatPrice } from '../../utils/format';
import StockCell from './StockCell';

function SortableHeader({ field, label, sort, onSort }) {
  const [sortField, sortDir] = sort.split('-');
  const isActive = sortField === field;

  function handleClick() {
    onSort(isActive && sortDir === 'asc' ? `${field}-desc` : `${field}-asc`);
  }

  return (
    <th scope="col" aria-sort={isActive ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}>
      <button type='button' className="sort-button" onClick={handleClick}>
        {label}
        <span className="sort-button__icon" aria-hidden="true">
          {isActive ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
        </span>
      </button>
    </th>
  )
}

export default function ProductTable({ products, sort, onSort, selectedIds, onToggle, onToggleAll, onDelete, onStockSave, onStockInvalid, returnTo }) {
  const selectedCount = products.filter((p) => selectedIds.includes(p.id)).length;
  const allSelected = products.length > 0 && selectedCount === products.length;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <div className="table-wrap">
      <table className="admin-table">
        <caption className="sr-only">상품 목록</caption>
        <thead>
          <tr>
            <th scope="col" className="admin-table__check">
              <input
                type='checkbox'
                aria-label="현재 페이지 전체 선택"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={(e) => onToggleAll(e.target.checked)}
              />
            </th>
            <th scope="col">이미지</th>
            <SortableHeader field="title" label="상품명" sort={sort} onSort={onSort} />
            <th scope="col">카테고리</th>
            <SortableHeader field="price" label="가격" sort={sort} onSort={onSort} />
            <SortableHeader field="stock" label="재고" sort={sort} onSort={onSort} />
            <SortableHeader field="created" label="등록일" sort={sort} onSort={onSort} />
            <th scope="col">관리</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const { id, title, brand, category, thumbnail, price, discountPercentage, createdAt } = product;
            const isSelected = selectedIds.includes(id);

            return (
              <tr key={id} className={isSelected ? 'is-selected' : undefined}>
                <td className="admin-table__check">
                  <input type="checkbox" aria-label={`${title} 선택`} checked={isSelected} onChange={() => onToggle(id)} />
                </td>
                <td>
                  <img className="admin-table__thumb" src={thumbnail} alt="" width="48" height="48" />
                </td>
                <td>
                  <p className="admin-table__title">{title}</p>
                  <p className="admin-table__sub">{brand}</p>
                </td>
                <td className="admin-table__category">{category.replaceAll('-', ' ')}</td>
                <td>
                  {formatPrice(price)}
                  <p className="admin-table__sub">{Math.round(discountPercentage)}% 할인</p>
                </td>
                <td>
                  <StockCell product={product} onSave={onStockSave} onInvalid={onStockInvalid} />
                </td>
                <td>{new Date(createdAt).toLocaleDateString('ko-KR')}</td>
                <td>
                  <div className="admin-table__actions">
                    <Link to={`/admin/products/${id}/edit`} state={{ returnTo }} className="btn btn--sm">수정</Link>
                    <button type='button' className="btn btn--sm btn--danger-outline" onClick={() => onDelete([id])}>삭제</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}