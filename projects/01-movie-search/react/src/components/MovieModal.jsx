function MovieModal({ movie, loading, isFavorite, onClose, onToggleFavorite }) {
  const showDetail = !loading && movie;

  const posterUrl = showDetail && movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
  const year = showDetail && movie.release_date ? movie.release_date.slice(0, 4) : '';
  const genreNames = showDetail ? (movie.genres.map(g => g.name).join(', ') || '장르 없음') : '';

  return (
    <div className="modal">
      <div className="modal-dim" onClick={onClose}></div>
      <div className="modal-content">
        <button type="button" className="modal-close" onClick={onClose}>&times;</button>
        {showDetail ? (
          <>
            <img className="modal-poster" src={posterUrl} alt={movie.title} />
            <div className="modal-info">
              <h2 className="modal-title">{movie.title}</h2>
              <button type="button" className="modal-favorite" onClick={onToggleFavorite}>{isFavorite ? '★' : '☆'}</button>
              <p className="modal-meta">{year} · {genreNames} · 평점 {movie.vote_average.toFixed(1)}</p>
              <p className="modal-overview">{movie.overview || '줄거리 정보가 없습니다.'}</p>
            </div>
          </>
        ) : (
          <p className="modal-overview">불러오는 중...</p>
        )}
      </div>
    </div>
  )
}

export default MovieModal;