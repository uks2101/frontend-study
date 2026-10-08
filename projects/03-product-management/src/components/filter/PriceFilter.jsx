import { useState } from 'react';

export default function PriceFilter({ minPrice, maxPrice, onApply }) {
  const [min, setMin] = useState(minPrice ?? '');
  const [max, setMax] = useState(maxPrice ?? '');

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
      <form className="price-filter" onSubmit={handleSubmit}>
        <label htmlFor="min-price" className="sr-only">최소 가격</label>
        <input type="number" id="min-price" min="0" inputMode="numeric" placeholder='최소' value={min} onChange={(e) => setMin(e.target.value)} />
        <span aria-hidden="true">~</span>
        <label htmlFor="max-price" className="sr-only">최대 가격</label>
        <input type="number" id='max-price' min="0" inputMode="numeric" placeholder='최대' value={max} onChange={(e) => setMax(e.target.value)} />
        <button type='submit' className="btn btn--sm">적용</button>
      </form>
    </fieldset>
  )
}