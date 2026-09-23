import { useState, useEffect } from 'react'
import './App.css'
import MovieCard from './components/MovieCard'
import MovieModal from './components/MovieModal'
import { normalizeMovie, fetchPopularMovies, fetchSearchMovies, fetchMovieDetail } from './api/tmdb'
import { useDebounce } from './hooks/useDebounce'
import { getFavorites, saveFavorites } from './utils/favorites';

function App() {
  const [movies, setMovies] = useState([]);
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [movieDetail, setMovieDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  function handleToggleFavorite(movie) {
    const exists = favorites.some(fav => fav.id === movie.id);
    const updated = exists ? favorites.filter(fav => fav.id !== movie.id) : [...favorites, movie];

    setFavorites(updated);
    saveFavorites(updated);
  }

  const displayedMovies = showingFavoritesOnly ? favorites : movies;

  let content;
  if (loading) {
    content = <p className="empty">불러오는 중...</p>
  } else if (error) {
    content = <p className="empty">{error}</p>
  } else if (displayedMovies.length === 0) {
    content = <p className="empty">검색 결과가 없습니다.</p>
  } else {
    content = (
      <ul className="movie-list">
        {displayedMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={favorites.some(f => f.id === movie.id)}
            onToggleFavorite={() => handleToggleFavorite(movie)}
            onSelect={() => setSelectedMovieId(movie.id)}
          />
        ))}
      </ul>
    );
  }

  useEffect(() => {
    if (!selectedMovieId) return;

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

  function handleCloseModal() {
    setSelectedMovieId(null);
    setMovieDetail(null);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') handleCloseModal();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
            <input type="text" placeholder="작품을 검색해보세요." value={keyword} onChange={event => setKeyword(event.target.value)} />
          </div>
          <button type="submit">검색</button>
        </form>
      </section>
      <section className="movie-wrap">
        <h1>인기 영화 목록</h1>
        {content}
      </section>
      {selectedMovieId && (
        <MovieModal 
          movie={movieDetail}
          loading={detailLoading}
          isFavorite={movieDetail ? favorites.some(f => f.id === movieDetail.id) : false}
          onClose={handleCloseModal}
          onToggleFavorite={() => handleToggleFavorite(normalizeMovie(movieDetail))}
        />
      )}
    </main>
  )
}

export default App
