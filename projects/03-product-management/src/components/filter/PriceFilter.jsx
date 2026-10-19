import { useId, useState } from 'react';

const PRICE_PRESETS = [
  { label: '$25 이하', min: null, max: 25 },
  { label: '$25 ~ $100', min: 25, max: 100 },
  { label: '$100 ~ $500', min: 100, max: 500 },
  { label: '$500 이상', min: 500, max: null }
];

export default function PriceFilter({ minPrice, maxPrice, onApply }) {
  const [min, setMin] = useState(minPrice ?? '');
  const [max, setMax] = useState(maxPrice ?? '');
  const minId = useId();
  const maxId = useId();

  function handleSubmit(e) {
    e.preventDefault();
    let nextMin = min === '' ? null : Number(min);
    let nextMax = max === '' ? null : Number(max);

    if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
      [nextMin, nextMax] = [nextMax, nextMin];
    }

    onApply(nextMin, nextMax);
  }

  return (
    <fieldset className="filter-group">
      <legend className="filter-group__title">가격 ($)</legend>

      <div className="price-presets" role="group" aria-label="가격대 빠른 선택">
        {PRICE_PRESETS.map((preset) => {
          const isActive = preset.min === minPrice && preset.max === maxPrice;
          return (
            <button
              key={preset.label}
              type='button'
              aria-pressed={isActive}
              onClick={() => (isActive ? onApply(null, null) : onApply(preset.min, preset.max))}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <form className="price-filter" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor={minId}>최소 가격</label>
        <input
          id={minId}
          type='number'
          min="0"
          inputMode="numeric"
          placeholder='최소'
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
        <span aria-hidden="true">~</span>
        <label className="sr-only" htmlFor={maxId}>최대 가격</label>
        <input
          id={maxId}
          type='number'
          min="0"
          inputMode="numeric"
          placeholder='최대'
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
        <button type='submit' className="btn btn--sm">적용</button>
      </form>
    </fieldset>
  )
}