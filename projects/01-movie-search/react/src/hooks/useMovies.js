import { useState, useEffect } from 'react';
import { normalizeMovie, fetchPopularMovies, fetchSearchMovies } from '../api/tmdb';
import { useDebounce } from './useDebounce';

export function useMovies() {
  const [keyword, setKeyword] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    const controller = new AbortController();
    const trimmed = debouncedKeyword.trim();

    async function load() {
      setError(null);

      try {
        const results = trimmed ? await fetchSearchMovies(trimmed, controller.signal) : await fetchPopularMovies(controller.signal);
        setMovies(results.map(normalizeMovie));
        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error(err);
        setError(trimmed ? '검색에 실패했습니다. 잠시 후 다시 시도해주세요.' : '영화 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [debouncedKeyword]);

  return { keyword, setKeyword, movies, loading, error }
}