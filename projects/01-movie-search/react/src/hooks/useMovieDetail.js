import { useState, useEffect } from 'react';
import { fetchMovieDetail } from '../api/tmdb';

export function useMovieDetail(selectedMovieId) {
  const [movieDetail, setMovieDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!selectedMovieId) {
      setMovieDetail(null);
      return;
    }

    const controller = new AbortController();
    setDetailLoading(true);

    async function load() {
      try {
        const detail = await fetchMovieDetail(selectedMovieId, controller.signal);
        setMovieDetail(detail);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error(err);
      } finally {
        setDetailLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [selectedMovieId]);

  return { movieDetail, detailLoading }
}