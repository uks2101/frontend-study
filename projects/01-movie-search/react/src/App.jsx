import { useState } from 'react'
import './App.css'
import MovieCard from './components/MovieCard'

function App() {
  const [movies, setMovies] = useState([
    { id: 1, title: '부산행', year: '2016', path: 'image/a.jpeg' },
    { id: 2, title: '기생충', year: '2019', path: 'image/b.jpeg' },
  ]);
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false);

  return (
    <main>
      <section className="search-wrap">
        <div>
          <h1>검색</h1>
          <button type="button" onClick={() => setShowingFavoritesOnly(!showingFavoritesOnly)}>{showingFavoritesOnly ? '전체보기' : '즐겨찾기'}</button>
        </div>
        <form id="search-form">
          <div className="search-box">
            <img src="image/search.svg" alt="search" />
            <input type="text" id="search-input" placeholder="작품을 검색해보세요." />
          </div>
          <button type="submit">검색</button>
        </form>
      </section>
      <section className="movie-wrap">
        <h1>인기 영화 목록</h1>
        <ul className="movie-list">
          {movies.map(movie => (
            <MovieCard 
              key={movie.id}
              movie={movie}
            />
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
