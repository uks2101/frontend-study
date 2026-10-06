import MemberRow from './MemberRow';

function MemberTable({
  members,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  sortState,
  onSortChange,
}) {
  const allSelected = members.length > 0 && members.every((member) => selectedIds.has(member.id));

  return (
    <table id="member-table">
      <thead>
        <tr>
          <th>
            <input type="checkbox" checked={allSelected} onChange={(event) => onToggleSelectAll(event.target.checked)} />
          </th>
          <th data-sort="name" onClick={() => onSortChange('name')}>
            이름
            <span className="sort-indicator">
              {sortState.key === 'name' ? (sortState.order === 'asc' ? ' ▲' : ' ▼') : ''}
            </span>
          </th>
          <th>이메일</th>
          <th>전화번호</th>
          <th data-sort="joinedAt" onClick={() => onSortChange('joinedAt')}>
            가입일
            <span className="sort-indicator">
              {sortState.key === 'joinedAt' ? (sortState.order === 'asc' ? ' ▲' : ' ▼') : ''}
            </span>
          </th>
          <th>상태</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            selected={selectedIds.has(member.id)}
            onToggleSelect={onToggleSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}

export default MemberTable;
