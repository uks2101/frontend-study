import { useState } from 'react';
import { useMembers } from './hooks/useMembers';
import MemberFormModal from './components/MemberFormModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const { members, addMember, updateMember, deleteMembers } = useMembers();

  function openAddModal() {
    setEditingMember(null);
    setIsModalOpen(true);
  }

  function openEditModal(member) {
    setEditingMember(member);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingMember(null);
  }

  function handleSave(values) {
    if (editingMember) {
      updateMember(editingMember.id, values);
    } else {
      addMember(values);
    }
    closeModal();
  }

  return (
    <div>
      <button type='button' onClick={openAddModal}>회원 등록</button>

      {isModalOpen && (
        <MemberFormModal
          editingMember={editingMember}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default App
