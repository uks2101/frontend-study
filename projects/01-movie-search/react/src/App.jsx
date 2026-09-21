import { useState, useEffect } from 'react'
import './App.css'
import MovieCard from './components/MovieCard'
import { normalizeMovie, fetchPopularMovies } from './api/tmdb'

function App() {
  const [movies, setMovies] = useState([]);
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    console.log('검색 제출');
  }

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const results = await fetchPopularMovies(controller.signal);
        setMovies(results.map(normalizeMovie));
        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error(err);
        setError('영화 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

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
            <input type="text" id="search-input" placeholder="작품을 검색해보세요." />
          </div>
          <button type="submit">검색</button>
        </form>
      </section>
      <section className="movie-wrap">
        <h1>인기 영화 목록</h1>
        {loading && <p className="empty">불러오는 중...</p>}
        {error && <p className="empty">{error}</p>}
        {!loading && !error && (
          <ul className="movie-list">
            {movies.map(movie => (
              <MovieCard 
                key={movie.id}
                movie={movie}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
