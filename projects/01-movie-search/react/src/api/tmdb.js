const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export function normalizeMovie(tmdbMovie) {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    year: tmdbMovie.release_date ? tmdbMovie.release_date.slice(0, 4) : '개봉일 미정',
    path: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null
  };
}

export async function fetchPopularMovies(signal) {
  const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR&page=1`, { signal });
  if (!response.ok) throw new Error('영화 목록을 불러오지 못했습니다.');
  const data = await response.json();
  return data.results;
}

export async function fetchSearchMovies(keyword, signal) {
  const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR&query=${encodeURIComponent(keyword)}`, { signal });
  if (!response.ok) throw new Error('검색에 실패했습니다.');
  const data = await response.json();
  return data.results;
}

export async function fetchMovieDetail(id, signal) {
  const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=ko-KR`, {signal});
  if (!response.ok) throw new Error('상세 정보를 불러오지 못했습니다.');
  return response.json();
}