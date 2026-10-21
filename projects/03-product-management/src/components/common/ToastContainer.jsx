import { useEffect, useState } from 'react';

const ICONS = { success: '✓', info: 'i', error: '!' };

function ToastItem({ toast, onDismiss }) {
  const { id, type, message, duration, action } = toast;
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, paused, onDismiss]);

  function handleAction() {
    action.onClick();
    onDismiss(id);
  }

  return (
    <li
      className={`toast toast--${type}`}
      role={type === 'error' ? 'alert' : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="toast__icon" aria-hidden="true">
        {ICONS[type]}
      </span>
      <p className="toast__message">{message}</p>
      {action && (
        <button type="button" className="toast__action" onClick={handleAction}>
          {action.label}
        </button>
      )}
      <button
        type="button"
        className="toast__close"
        aria-label="알림 닫기"
        onClick={() => onDismiss(id)}
      >
        ×
      </button>
    </li>
  );
}

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <section className="toast-container" aria-label="알림" aria-live="polite">
      <ol className="toast-list">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </ol>
    </section>
  );
}
