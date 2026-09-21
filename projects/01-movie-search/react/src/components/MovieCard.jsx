function MovieCard({ movie }) {
  return (
    <li className="movie-card">
      <button type="button" className="favorite-btn" data-favorite>☆</button>
      <img src={movie.path} alt={movie.title} />
      <div>
        <p>{movie.title}</p>
        <span>{movie.year}</span>
      </div>
    </li>
  )
}

export default MovieCard
