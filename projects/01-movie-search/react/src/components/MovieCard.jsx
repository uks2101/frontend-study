function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  function handleFavoriteClick(event) {
    event.stopPropagation();
    onToggleFavorite();
  }

  return (
    <li className="movie-card">
      <button type="button" className="favorite-btn" onClick={handleFavoriteClick}>{isFavorite ? '★' : '☆'}</button>
      <img src={movie.path} alt={movie.title} />
      <div>
        <p>{movie.title}</p>
        <span>{movie.year}</span>
      </div>
    </li>
  )
}

export default MovieCard
