import { useEffect, useId, useRef } from 'react';

export default function Drawer({ open, title, onClose, footer, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleCancel(e) {
    e.preventDefault();
    onClose();
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="drawer"
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className="drawer__header">
        <h2 id={titleId} className="drawer__title">
          {title}
        </h2>
        <button type="button" className="drawer__close" aria-label="닫기" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="drawer__body">{open && children}</div>
      {footer && <div className="drawer__footer">{footer}</div>}
    </dialog>
  );
}
