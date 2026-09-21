import { useState } from 'react';

function MovieCard({ movie }) {
  const [isFavorite, setIsFavorite] = useState(false);

  function handleFavoriteClick(event) {
    event.stopPropagation();
    setIsFavorite(!isFavorite);
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
