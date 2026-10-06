import { useState } from 'react';
import { validateForm } from '../utils/validators';

function MemberFormModal({ editingMember, onClose, onSave }) {
  const [values, setValues] = useState({
    name: editingMember?.name ?? '',
    email: editingMember?.email ?? '',
    phone: editingMember?.phone ?? '',
    joinedAt: editingMember?.joinedAt ?? '',
    status: editingMember?.status ?? 'active',
  });
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSave(values);
  }

  return (
    <div className="modal">
      <div className="modal-dim" onClick={onClose}></div>
      <form className="member-form" onSubmit={handleSubmit}>
        <h2>{editingMember ? '회원 정보 수정' : '회원 등록'}</h2>

        <label>
          이름
          <input type="text" name="name" value={values.name} onChange={handleChange} />
        </label>
        <p className="error-message">{errors.name}</p>

        <label>
          이메일
          <input type="email" name="email" value={values.email} onChange={handleChange} />
        </label>
        <p className="error-message">{errors.email}</p>

        <label>
          전화번호
          <input type="text" name="phone" value={values.phone} onChange={handleChange} />
        </label>
        <p className="error-message">{errors.phone}</p>

        <label>
          가입일
          <input type="date" name="joinedAt" value={values.joinedAt} onChange={handleChange} />
        </label>
        <p className="error-message">{errors.joinedAt}</p>

        <label>
          상태
          <select name="status" value={values.status} onChange={handleChange}>
            <option value="active">활성</option>
            <option value="inactive">휴면</option>
          </select>
        </label>

        <div>
          <button type="submit" className="btn-save">저장</button>
          <button type="button" className="btn-cancel" onClick={onClose}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default MemberFormModal;
