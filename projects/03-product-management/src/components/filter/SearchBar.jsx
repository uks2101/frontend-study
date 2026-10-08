import { useState, useEffect, useEffectEvent } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchBar({ value, onSearch }) {
  const [input, setInput] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const debouncedInput = useDebounce(input, 300);

  if (value !== prevValue) {
    setPrevValue(value);
    setInput(value);
  }

  const syncSearch = useEffectEvent((term) => {
    if (term !== value) onSearch(term);
  });

  useEffect(() => {
    syncSearch(debouncedInput);
  }, [debouncedInput]);

  return (
    <div className="search-bar">
      <label htmlFor="product-search" className="sr-only">상품 검색</label>
      <input type="search" id="product-search" className="search-bar__input" placeholder="상품명, 브랜드 검색" value={input} onChange={(e) => setInput(e.target.value)} />
    </div>
  )
}