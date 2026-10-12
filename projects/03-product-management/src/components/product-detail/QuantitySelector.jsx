import { useState } from 'react';

export default function QuantitySelector({ value, max, onChange, disabled = false }) {
  const [draft, setDraft] = useState(null);

  function clamp(next) {
    return Math.min(Math.max(next, 1), max);
  }

  function commitDraft() {
    const next = Math.floor(Number(draft));
    if (draft !== null && next > 0) {
      onChange(clamp(next));
    }
    setDraft(null);
  }

  return (
    <div className="quantity">
      <button
        type='button'
        className="quantity__button"
        aria-label="수량 줄이기"
        disabled={disabled || value <= 1}
        onClick={() => onChange(clamp(value - 1))}
      >
        -
      </button>
      <input
        type='number'
        className="quantity__input"
        aria-label="수량"
        min="1"
        max={max}
        value={draft ?? value}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commitDraft}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      />
      <button
        type='button'
        className="quantity__button"
        aria-label="수량 늘리기"
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1))}
      >
        +
      </button>
    </div>
  )
}