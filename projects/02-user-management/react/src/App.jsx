import { useState, useMemo } from 'react';
import { useMembers } from './hooks/useMembers';
import MemberFormModal from './components/MemberFormModal';
import MemberTable from './components/MemberTable';
import Toolbar from './components/Toolbar';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const { members, addMember, updateMember, deleteMembers } = useMembers();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortState, setSortState] = useState({ key: null, order: 'asc' });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const visibleMembers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    const filtered = members.filter((member) => {
      const matchesKeyword =
        !keyword ||
        member.name.toLowerCase().includes(keyword) ||
        member.email.toLowerCase().includes(keyword);
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      return matchesKeyword && matchesStatus;
    });

    if (!sortState.key) return filtered;

    return [...filtered].sort((a, b) => {
      const key = sortState.key;
      if (a[key] < b[key]) return sortState.order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return sortState.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [members, searchKeyword, statusFilter, sortState]);

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
    setSelectedIds(checked ? new Set(visibleMembers.map((member) => member.id)) : new Set());
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
      {isModalOpen && (
        <MemberFormModal
          editingMember={editingMember}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      <Toolbar
        onAdd={openAddModal}
        onDeleteSelected={handleDeleteSelected}
        deleteDisabled={selectedIds.size === 0}
        onSearchChange={setSearchKeyword}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {visibleMembers.length === 0 ? (
        <p>표시할 회원이 없습니다.</p>
      ) : (
        <MemberTable
          members={visibleMembers}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onEdit={openEditModal}
          onDelete={handleDelete}
          sortState={sortState}
          onSortChange={handleSortChange}
        />
      )}
    </div>
  );
}

export default App
