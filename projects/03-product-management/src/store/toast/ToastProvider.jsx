import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ToastContext } from './toastContext';
import ToastContainer from '../../components/common/ToastContainer';

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 3000;

let nextId = 0;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useMemo(() => {
    function show(type, message, { duration = DEFAULT_DURATION, action } = {}) {
      const id = ++nextId;
      setToasts((prev) => [...prev, { id, type, message, duration, action }].slice(-MAX_TOASTS));
      return id;
    }

    return {
      success: (message, options) => show('success', message, options),
      info: (message, options) => show('info', message, options),
      error: (message, options) => show('error', message, { duration: 5000, ...options }),
      dismiss: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    };
  }, []);

  return (
    <ToastContext value={toast}>
      {children}
      {createPortal(<ToastContainer toasts={toasts} onDismiss={toast.dismiss} />, document.body)}
    </ToastContext>
  )
}