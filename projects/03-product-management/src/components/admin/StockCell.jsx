import { useState } from 'react';

const LOW_STOCK = 10;

export default function StockCell({ product, onSave, onInvalid }) {
  const { title, stock } = product;
  const [draft, setDraft] = useState(null);
  const [restoreFocus, setRestoreFocus] = useState(false);

  function handleBlur(e) {
    const action = e.currentTarget.dataset.action;
    setDraft(null);
    setRestoreFocus(Boolean(action));

    if (action === 'cancel') return;

    const next = Number(draft);
    if (draft.trim() === '' || !Number.isInteger(next) || next < 0) {
      onInvalid('재고는 0 이상의 정수로 입력해주세요.');
      return;
    }
    if (next !== stock) onSave(product, next);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.currentTarget.dataset.action = 'save';
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      e.currentTarget.dataset.action = 'cancel';
      e.currentTarget.blur();
    }
  }

  if (draft === null) {
    return (
      <button
        type='button'
        className={stock < LOW_STOCK ? 'stock-badge stock-badge--low' : 'stock-badge'}
        aria-label={`${title} 재고 ${stock}개, 수정하기`}
        autoFocus={restoreFocus}
        onClick={() => setDraft(String(stock))}
      >
        {stock}
      </button>
    );
  }

  return (
    <input
      type='number'
      className="stock-input"
      aria-label={`${title} 재고`}
      min="0"
      step="1"
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  )
}