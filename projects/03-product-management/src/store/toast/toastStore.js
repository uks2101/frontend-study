import { create } from 'zustand';

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 3000;

let nextId = 0;

export const useToastStore = create(() => ({ toasts: [] }));

function show(type, message, { duration = DEFAULT_DURATION, action } = {}) {
  const id = ++nextId;
  useToastStore.setState((state) => ({
    toasts: [...state.toasts, { id, type, message, duration, action }].slice(-MAX_TOASTS),
  }));
  return id;
}

export function dismissToast(id) {
  useToastStore.setState((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
}

export const toast = {
  success: (message, options) => show('success', message, options),
  info: (message, options) => show('info', message, options),
  error: (message, options) => show('error', message, { duration: 5000, ...options }),
};
