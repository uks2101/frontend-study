let memberListEl = document.getElementById('member-list');

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
  return `
    <tr>
      <td><input type="checkbox" class="row-checkbox" data-id="${member.id}"></td>
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
  memberListEl.innerHTML = members.map((member) => {
    return renderRow(member);
  }).join('');
}

members = loadMembers();
renderMembers();
