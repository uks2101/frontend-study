import { useEffect, useId, useRef } from 'react';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '확인',
  pendingLabel = '처리 중...',
  isPending = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleCancel(e) {
    e.preventDefault();
    if (!isPending) onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onCancel={handleCancel}
    >
      <h2 id={titleId} className="dialog__title">
        {title}
      </h2>
      <p id={descId} className="dialog__desc">
        {description}
      </p>

      <div className="dialog__actions">
        <button type="button" className="btn" disabled={isPending} onClick={onCancel}>
          취소
        </button>
        <button type="button" className="btn btn--danger" disabled={isPending} onClick={onConfirm}>
          {isPending ? pendingLabel : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
