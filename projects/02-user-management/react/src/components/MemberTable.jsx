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
    <table>
      <thead>
        <tr>
          <th>
            <input type="checkbox" checked={allSelected} onChange={(event) => onToggleSelectAll(event.target.checked)} />
          </th>
          <th onClick={() => onSortChange('name')}>
            이름{sortState.key === 'name' ? (sortState.order === 'asc' ? ' ▲' : ' ▼') : ''}
          </th>
          <th>이메일</th>
          <th>전화번호</th>
          <th onClick={() => onSortChange('joinedAt')}>
            가입일{sortState.key === 'joinedAt' ? (sortState.order === 'asc' ? ' ▲' : ' ▼') : ''}
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
