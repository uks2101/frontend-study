import MovieCard from './MovieCard';

function MovieList({ movies, loading, error, isFavorite, onToggleFavorite, onSelectMovie }) {
  if (loading) return <p className="empty">불러오는 중...</p>;
  if (error) return <p className="empty">{error}</p>;
  if (movies.length === 0) return <p className="empty">검색 결과가 없습니다.</p>;

  return (
    <ul className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={isFavorite(movie.id)}
          onToggleFavorite={() => onToggleFavorite(movie)}
          onSelect={() => onSelectMovie(movie.id)}
        />
      ))}
    </ul>
  )
}

export default MovieList