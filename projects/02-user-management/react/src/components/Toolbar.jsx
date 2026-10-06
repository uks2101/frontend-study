import { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { SEARCH_DEBOUNCE_DELAY } from '../utils/constants';

function Toolbar({
  onAdd,
  onDeleteSelected,
  deleteDisabled,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}) {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_DELAY);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return (
    <section>
      <div className="search-wrap">
        <input
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="이름 또는 이메일 검색"
        />
      </div>

      <div className="status-wrap">
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
        >
          <option value="all">전체</option>
          <option value="active">활성</option>
          <option value="inactive">휴면</option>
        </select>

        <div>
          <button type="button" className="btn-primary" onClick={onAdd}>
            회원 등록
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={onDeleteSelected}
            disabled={deleteDisabled}
          >
            회원 삭제
          </button>
        </div>
      </div>
    </section>
  );
}

export default Toolbar
