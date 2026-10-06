import { useState, useMemo } from 'react';
import { useMembers } from './hooks/useMembers';
import MemberFormModal from './components/MemberFormModal';
import MemberTable from './components/MemberTable';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const { members, addMember, updateMember, deleteMembers } = useMembers();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortState, setSortState] = useState({ key: null, order: 'asc' });

  const sortedMembers = useMemo(() => {
    if (!sortState.key) return members;
    return [...members].sort((a, b) => {
      const key = sortState.key;
      if (a[key] < b[key]) return sortState.order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return sortState.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [members, sortState]);

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

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll(checked) {
    setSelectedIds(checked ? new Set(sortedMembers.map((member) => member.id)) : new Set());
  }

  function handleDelete(id) {
    if (!confirm('삭제하시겠습니까?')) return;
    deleteMembers(new Set([id]));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleDeleteSelected() {
    if (selectedIds.size === 0) return;
    if (!confirm(`선택한 ${selectedIds.size}명을 삭제하시겠습니까?`)) return;
    deleteMembers(selectedIds);
    setSelectedIds(new Set());
  }

  function handleSortChange(key) {
    setSortState((prev) => prev.key === key ? { key, order: prev.order === 'asc' ? 'desc' : 'asc' } : { key, order: 'asc' });
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

      <MemberTable
        members={sortedMembers}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onEdit={openEditModal}
        onDelete={handleDelete}
        sortState={sortState}
        onSortChange={handleSortChange}
      />
    </div>
  );
}

export default App
