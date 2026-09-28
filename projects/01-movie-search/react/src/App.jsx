import { useState, useEffect } from 'react'
import './App.css'
import MovieModal from './components/MovieModal'
import SearchForm from './components/SearchForm'
import MovieList from './components/MovieList'
import { useFavorites } from './hooks/useFavorites'
import { useMovies } from './hooks/useMovies'
import { useMovieDetail } from './hooks/useMovieDetail'
import { normalizeMovie } from './api/tmdb'

function App() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { keyword, setKeyword, movies, loading, error } = useMovies();
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const { movieDetail, detailLoading } = useMovieDetail(selectedMovieId);

  const displayedMovies = showingFavoritesOnly ? favorites : movies;

  async function handleSubmit(event) {
    event.preventDefault();
  }

  function handleCloseModal() {
    setSelectedMovieId(null);
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
      <SearchForm 
        keyword={keyword}
        onKeywordChange={setKeyword}
        onSubmit={handleSubmit}
        showingFavoritesOnly={showingFavoritesOnly}
        onToggleFavoritesOnly={() => setShowingFavoritesOnly(!showingFavoritesOnly)}
      />
      <section className="movie-wrap">
        <h1>인기 영화 목록</h1>
        <MovieList 
          movies={displayedMovies}
          loading={loading}
          error={error}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onSelectMovie={setSelectedMovieId}
        />
      </section>
      {selectedMovieId && (
        <MovieModal 
          movie={movieDetail}
          loading={detailLoading}
          isFavorite={movieDetail ? isFavorite(movieDetail.id) : false}
          onClose={handleCloseModal}
          onToggleFavorite={() => toggleFavorite(normalizeMovie(movieDetail))}
        />
      )}
    </main>
  )
}

export default App
