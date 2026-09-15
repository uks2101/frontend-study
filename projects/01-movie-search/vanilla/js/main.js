function normalizeMovie(tmdbMovie) {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    year: tmdbMovie.release_date ? tmdbMovie.release_date.slice(0, 4) : '개봉일 미정',
    path: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null
  };
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchPopularMovies() {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=ko-KR&page=1`);
    if (!response.ok) throw new Error('영화 목록을 불러오지 못했습니다.');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function getMovies(movieArray) {
  const movieList = document.querySelector('.movie-list');

  if(!movieList) {
    console.error('movie-list 요소를 찾을 수 없습니다.');
    return;
  }

  movieList.innerHTML = '';

  if (movieArray.length === 0) {
    movieList.innerHTML = '<li class="empty">검색 결과가 없습니다.</li>';
    return;
  }

  movieArray.forEach(movie => {
    const card = document.createElement('li');
    card.classList.add('movie-card');

    const postUrl = movie.path;

    card.innerHTML = `
    <img src="${postUrl}" alt="${movie.title}">
    <div>
      <p>${movie.title}</p>
      <span>${movie.year}</span>
    </div>
    `;

    movieList.appendChild(card);

  });
}

async function init() {
  const movieList = document.querySelector('.movie-list');
  movieList.innerHTML = '<li class="empty">불러오는 중...</li>';

  const popularMovies = await fetchPopularMovies();
  getMovies(popularMovies.map(normalizeMovie));
}

async function fetchSearchMovies(keyword) {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=ko-KR&query=${encodeURIComponent(keyword)}`);
    if (!response.ok) throw new Error('검색에 실패했습니다.');
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function searchMovies(keyword) {
  const trimmed = keyword.trim();
  const results = trimmed ? await fetchSearchMovies(trimmed) : await fetchPopularMovies();
  
  getMovies(results.map(normalizeMovie));
}

function debounce(callback, delay) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => callback(...args), delay);
  };
}

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  searchMovies(searchInput.value);
});

const debounceSearch = debounce(() => searchMovies(searchInput.value), 300);
searchInput.addEventListener('input', debounceSearch);

init();