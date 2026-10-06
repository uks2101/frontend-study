import { STATUS_LABEL } from '../utils/constants';

function MemberRow({ member, selected, onToggleSelect, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <input type="checkbox" checked={selected} onChange={() => onToggleSelect(member.id)} />
      </td>
      <td>{member.name}</td>
      <td>{member.email}</td>
      <td>{member.phone}</td>
      <td>{member.joinedAt}</td>
      <td>{STATUS_LABEL[member.status]}</td>
      <td>
        <button type="button" onClick={() => onEdit(member)}>수정</button>
        <button type="button" onClick={() => onDelete(member.id)}>삭제</button>
      </td>
    </tr>
  );
}

export default MemberRow;
