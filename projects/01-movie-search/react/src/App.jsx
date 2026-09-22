import { useState, useEffect } from 'react'
import './App.css'
import MovieCard from './components/MovieCard'
import { normalizeMovie, fetchPopularMovies, fetchSearchMovies } from './api/tmdb'
import { useDebounce } from './hooks/useDebounce'

function App() {
  const [movies, setMovies] = useState([]);
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);

  async function handleSubmit(event) {
    event.preventDefault();
  }

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

  let content;
  if (loading) {
    content = <p className="empty">불러오는 중...</p>
  } else if (error) {
    content = <p className="empty">{error}</p>
  } else if (movies.length === 0) {
    content = <p className="empty">검색 결과가 없습니다.</p>
  } else {
    content = (
      <ul className="movie-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ul>
    );
  }

  return (
    <main>
      <section className="search-wrap">
        <div>
          <h1>검색</h1>
          <button type="button" onClick={() => setShowingFavoritesOnly(!showingFavoritesOnly)}>{showingFavoritesOnly ? '전체보기' : '즐겨찾기'}</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="search-box">
            <img src="image/search.svg" alt="search" />
            <input type="text" placeholder="작품을 검색해보세요." value={keyword} onChange={event => setKeyword(event.target.value)} />
          </div>
          <button type="submit">검색</button>
        </form>
      </section>
      <section className="movie-wrap">
        <h1>인기 영화 목록</h1>
        {content}
      </section>
    </main>
  )
}

export default App
