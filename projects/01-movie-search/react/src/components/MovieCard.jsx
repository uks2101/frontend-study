function MovieCard({ movie, isFavorite, onToggleFavorite, onSelect }) {
  function handleFavoriteClick(event) {
    event.stopPropagation();
    onToggleFavorite();
  }

  return (
    <li className="movie-card" onClick={(event) => {event.stopPropagation(); onSelect();}}>
      <button type="button" className="favorite-btn" onClick={handleFavoriteClick}>{isFavorite ? '★' : '☆'}</button>
      <img src={movie.path} alt={movie.title} />
      <div>
        <p>{movie.title}</p>
        <span>{movie.year}</span>
      </div>
    </li>
  )
}

export default MovieCard;
