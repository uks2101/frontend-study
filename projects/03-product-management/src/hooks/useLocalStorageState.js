import { useState, useEffect } from 'react';

function readStorage(key, initialValue) {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 저장 공간이 가득 찼거나 시크릿 모드 -> 저장만 포기하고 화면은 정상 동작
    }
  }, [key, value]);

  return [value, setValue];
}
