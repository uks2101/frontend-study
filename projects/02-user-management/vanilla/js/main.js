let addMemberBtn = document.getElementById('add-member-btn');
let memberModal = document.getElementById('member-modal');
let memberForm = document.getElementById('member-form');
let cancelBtn = document.getElementById('cancel-btn');
let memberIdInput = document.getElementById('member-id');
let memberNameInput = document.getElementById('member-name');
let memberEmailInput = document.getElementById('member-email');
let memberPhoneInput = document.getElementById('member-phone');
let memberJoinedInput = document.getElementById('member-joined');
let memberStatusInput = document.getElementById('member-status');
let memberListEl = document.getElementById('member-list');
let resultCountEl = document.getElementById('result-count');
let emptyStateEl = document.getElementById('empty-state');
let memberTableEl = document.getElementById('member-table');

const selectedIds = new Set();
let deleteSelectedBtn = document.getElementById('delete-selected-btn');
let selectAllCheckbox = document.getElementById('select-all');

let searchKeyword = '';
let searchInput = document.getElementById('search-input');

let statusFilter = 'all';
let sortState = { key: null, order: 'asc' };
let statusFilterSelect = document.getElementById('status-filter');

let members = [];

function generateId() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadMembers() {
  let raw = localStorage.getItem(STORAGE_KEY);

  if (raw !== null) {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  } else {
    const seeded = SEED_MEMBERS.map((member) => ({
      id: generateId(), ...member
    }));
    saveMembers(seeded);
    return seeded;
  }
}

function saveMembers(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderRow(member) {
  const checked = selectedIds.has(member.id) ? 'checked' : '';
  return `
    <tr>
      <td><input type="checkbox" class="row-checkbox" data-id="${member.id}" ${checked}></td>
      <td>${member.name}</td>
      <td>${member.email}</td>
      <td>${member.phone}</td>
      <td>${member.joinedAt}</td>
      <td>${STATUS_LABEL[member.status]}</td>
      <td>
        <button type="button" data-action="edit" data-id="${member.id}">수정</button>
        <button type="button" data-action="delete" data-id="${member.id}">삭제</button>
      </td>
    </tr>
  `
}

function renderMembers() {
  const keyword = searchKeyword.trim().toLowerCase();

  const filtered = members.filter((member) => {
    const matchesKeyword =
      !keyword ||
      member.name.toLowerCase().includes(keyword) ||
      member.email.toLowerCase().includes(keyword);
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesKeyword && matchesStatus;
  });

  if (sortState.key) {
    filtered.sort((a, b) => {
      const key = sortState.key;
      if (a[key] < b[key]) return sortState.order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return sortState.order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  if (filtered.length === 0) {
    memberTableEl.hidden = true;
    emptyStateEl.hidden = false;
  } else if (filtered.length > 0) {
    memberTableEl.hidden = false;
    emptyStateEl.hidden = true;
  }

  resultCountEl.textContent = `총 ${members.length}명 중 ${filtered.length}명 표시`;

  memberListEl.innerHTML = filtered.map((member) => {
    return renderRow(member);
  }).join('');
}

members = loadMembers();
renderMembers();

function openAddModal() {
  memberForm.reset();
  memberIdInput.value = '';
  memberModal.hidden = false;
}

function closeModal() {
  memberModal.hidden = true;
  memberForm.reset();
}

function handleFormSubmit(event) {
  event.preventDefault();

  const values = {
    name: memberNameInput.value,
    email: memberEmailInput.value,
    phone: memberPhoneInput.value,
    joinedAt: memberJoinedInput.value,
    status: memberStatusInput.value,
  };

  const errors = validateForm(values);
  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }

  clearErrors();

  const editingId = memberIdInput.value;
  if (editingId) {
    members = members.map((member) => {
      return member.id === editingId ? { ...member, ...values } : member;
    });
  } else {
    members.push({ id: generateId(), ...values });
  }

  saveMembers(members);
  closeModal();
  renderMembers();
}

addMemberBtn.addEventListener('click', openAddModal);
cancelBtn.addEventListener('click', closeModal);
memberForm.addEventListener('submit', handleFormSubmit);

function validateForm(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = '이름을 입력해주세요.';
  }

  if (!values.email.trim()) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = '이메일 형식이 올바르지 않습니다.';
  }

  if (!values.phone.trim()) {
    errors.phone = '전화번호를 입력해주세요.';
  } else if (!PHONE_REGEX.test(values.phone.trim())) {
    errors.phone = '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)';
  }

  if (!values.joinedAt) {
    errors.joinedAt = '가입일을 선택해주세요.';
  }

  return errors;
}

function showErrors(errors) {
  clearErrors();
  Object.entries(errors).forEach(([field, message]) => {
    const errorEl = memberForm.querySelector(`[data-error="${field}"]`);
    if (errorEl) errorEl.textContent = message;
  });
}

function clearErrors() {
  memberForm.querySelectorAll('[data-error]').forEach((el) => {
    el.textContent = '';
  });
}

function openEditModal(id) {
  const member = members.find((item) => item.id === id);
  if (!member) return;

  memberIdInput.value = member.id;
  memberNameInput.value = member.name;
  memberEmailInput.value = member.email;
  memberPhoneInput.value = member.phone;
  memberJoinedInput.value = member.joinedAt;
  memberStatusInput.value = member.status;

  clearErrors();
  memberModal.hidden = false;
}

function deleteMember(id) {
  const member = members.find((item) => item.id === id);
  if (!member) return;

  const confirmed = confirm(`${member.name} 회원을 삭제하시겠습니까?`);
  if (!confirmed) return;

  members = members.filter((item) => item.id !== id);
  saveMembers(members);
  renderMembers();
}

memberListEl.addEventListener('click', (event) => {
  const actionBtn = event.target.closest('[data-action]');
  if (!actionBtn) return;

  const { action, id } = actionBtn.dataset;

  if (action === 'edit') {
    openEditModal(id);
  } else if (action === 'delete') {
    deleteMember(id);
  }
});

function updateDeleteSelectedButton() {
  selectedIds.size === 0 ? deleteSelectedBtn.disabled = true : deleteSelectedBtn.disabled = false;
}

memberListEl.addEventListener('change', (event) => {
  const checkbox = event.target.closest('.row-checkbox');
  if (!checkbox) return;

  const { id } = checkbox.dataset;
  checkbox.checked === true ? selectedIds.add(id) : selectedIds.delete(id);

  updateDeleteSelectedButton();
});

selectAllCheckbox.addEventListener('change', (event) => {
  if (event.target.checked) {
    members.forEach((member) => selectedIds.add(member.id));
  } else {
    selectedIds.clear();
  }

  renderMembers();
  updateDeleteSelectedButton();
});

function deleteSelectedMembers() {
  if (selectedIds.size === 0) return;

  const confirmed = confirm(`${selectedIds.size} 명 삭제하시겠습니까?`);
  if (!confirmed) return;

  members = members.filter((member) => !selectedIds.has(member.id));
  selectedIds.clear();
  saveMembers(members);
  renderMembers();
}

deleteSelectedBtn.addEventListener('click', deleteSelectedMembers);

function debounce(fn, delay) {
  let timerId = null;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

const handleSearchInput = debounce((event) => {
  searchKeyword = event.target.value;
  renderMembers();
}, SEARCH_DEBOUNCE_DELAY);

searchInput.addEventListener('input', handleSearchInput);

statusFilterSelect.addEventListener('change', (event) => {
  statusFilter = event.target.value;
  renderMembers();
});

document.querySelector('#member-table thead').addEventListener('click', (event) => {
  const th = event.target.closest('[data-sort]');
  if (!th) return;

  const key = th.dataset.sort;
  if (sortState.key === key) {
    sortState.order = sortState.order === 'asc' ? 'desc' : 'asc';
  } else {
    sortState = { key, order: 'asc' };
  }

  renderMembers();
});
