import { useState, useEffect } from 'react'
import { STORAGE_KEY, SEED_MEMBERS } from '../utils/constants'

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
    return seeded;
  }
}

export function useMembers() {
  const [members, setMembers] = useState(() => loadMembers());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  }, [members]);

  function addMember(values) {
    setMembers((prev) => [...prev, { id: generateId(), ...values }]);
  }

  function updateMember(id, values) {
    setMembers((prev) => prev.map((member) => (member.id === id ? { ...member, ...values } : member)));
  }

  function deleteMembers(ids) {
    setMembers((prev) => prev.filter((member) => !ids.has(member.id)));
  }

  return { members, addMember, updateMember, deleteMembers };
}