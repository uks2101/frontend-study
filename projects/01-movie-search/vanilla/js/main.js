function normalizeMovie(tmdbMovie) {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    year: tmdbMovie.release_date ? tmdbMovie.release_date.slice(0, 4) : '개봉일 미정',
    path: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : null
  };
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const NO_POSTER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300">' +
  '<rect width="100%" height="100%" fill="#2a2a2a"/>' +
  '<text x="50%" y="50%" fill="#6d6d6d" font-size="16" text-anchor="middle" dy=".3em">포스터 없음</text>' +
  '</svg>'
);

async function fetchPopularMovies(signal) {
  const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=ko-KR&page=1`, { signal });
  if (!response.ok) throw new Error('영화 목록을 불러오지 못했습니다.');
  const data = await response.json();
  return data.results;
}

function renderMessage(text) {
  const movieList = document.querySelector('.movie-list');
  movieList.innerHTML = `<li class="empty">${text}</li>`;
}

async function fetchMovieDetail(id) {
  const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=ko-KR`);
  if (!response.ok) throw new Error('상세 정보를 불러오지 못했습니다.');
  return response.json();
}

const movieModal = document.getElementById('movie-modal');

function openModal() {
  movieModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  movieModal.hidden = true;
  document.body.style.overflow = '';
}

let currentModalMovie = null;

function renderModalContent(movie) {
  currentModalMovie = movie;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '개봉일 미정';
  const genreNames = movie.genres.map(genre => genre.name).join(', ') || '장르 정보 없음';
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : NO_POSTER_IMAGE;

  movieModal.querySelector('.modal-poster').src = posterUrl;
  movieModal.querySelector('.modal-poster').alt = movie.title;
  movieModal.querySelector('.modal-title').textContent = movie.title;
  movieModal.querySelector('.modal-meta').textContent = `${year} · ${genreNames} · 평점 ${movie.vote_average.toFixed(1)}`;
  movieModal.querySelector('.modal-overview').textContent = movie.overview || '줄거리 정보가 없습니다.';

  movieModal.querySelector('.modal-favorite').textContent = isFavorite(movie.id) ? '★' : '☆';
}

movieModal.querySelector('.modal-favorite').addEventListener('click', () => {
  if (!currentModalMovie) return;

  const normalized = normalizeMovie(currentModalMovie);
  const isNowFavorite = toggleFavorite(normalized);
  movieModal.querySelector('.modal-favorite').textContent = isNowFavorite ? '★' : '☆';
});

async function showMovieDetail(id) {
  openModal();
  movieModal.querySelector('.modal-overview').textContent = '불러오는 중...';

  try {
    const movie = await fetchMovieDetail(id);
    renderModalContent(movie);
  } catch (error) {
    console.error(error);
    movieModal.querySelector('.modal-overview').textContent = '상세 정보를 불러오지 못했습니다.';
  }
}

movieModal.addEventListener('click', event => {
  if (event.target.dataset.close !== undefined) {
    closeModal();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !movieModal.hidden) {
    closeModal();
  }
});

const movieList = document.querySelector('.movie-list');

movieList.addEventListener('click', event => {
  const favoriteBtn = event.target.closest('[data-favorite]');
  if (favoriteBtn) {
    const card = favoriteBtn.closest('.movie-card');
    const movie = currentMovies.find(m => m.id === Number(card.dataset.id));
    const isNowFavorite = toggleFavorite(movie);
    favoriteBtn.textContent = isNowFavorite ? '★' : '☆';
    return;
  }

  const card = event.target.closest('.movie-card');
  if (!card) return;

  showMovieDetail(card.dataset.id);
});

let currentMovies = [];

function getMovies(movieArray) {
  const movieList = document.querySelector('.movie-list');
  currentMovies = movieArray;

  if(!movieList) {
    console.error('movie-list 요소를 찾을 수 없습니다.');
    return;
  }

  if (movieArray.length === 0) {
    renderMessage('검색 결과가 없습니다.');
    return;
  }

  movieList.innerHTML = '';

  movieArray.forEach(movie => {
    const card = document.createElement('li');
    card.classList.add('movie-card');
    card.dataset.id = movie.id;

    const postUrl = movie.path || NO_POSTER_IMAGE;

    card.innerHTML = `
    <button type="button" class="favorite-btn" data-favorite>${isFavorite(movie.id) ? '★' : '☆'}</button>
    <img src="${postUrl}" alt="${movie.title}">
    <div>
      <p>${movie.title}</p>
      <span>${movie.year}</span>
    </div>
    `;

    movieList.appendChild(card);

  });
}

let popularMoviesCache = [];

async function init() {
  renderMessage('불러오는 중...');

  try {
    const popularMovies = await fetchPopularMovies();
    popularMoviesCache = popularMovies.map(normalizeMovie);
    getMovies(popularMoviesCache);
  } catch (error) {
    console.error(error);
    renderMessage('영화 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
  }
}

async function fetchSearchMovies(keyword, signal) {
  const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=ko-KR&query=${encodeURIComponent(keyword)}`, { signal });
  if (!response.ok) throw new Error('검색에 실패했습니다.');
  const data = await response.json();
  return data.results;
}

let currentController = null;

async function searchMovies(keyword) {
  if (currentController) currentController.abort();
  currentController = new AbortController();
  const { signal } = currentController;

  const trimmed = keyword.trim();

  try {
    const results = trimmed ? await fetchSearchMovies(trimmed, signal) : await fetchPopularMovies(signal);
    getMovies(results.map(normalizeMovie));
  } catch (error) {
    if (error.name === 'AbortError') return;
    console.error(error);
    renderMessage('검색에 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
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

const FAVORITES_KEY = 'favorites';

function getFavorites() {
  const raw = localStorage.getItem(FAVORITES_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function isFavorite(id) {
  return getFavorites().some(movie => movie.id === Number(id));
}

function toggleFavorite(movie) {
  const favorites = getFavorites();
  const exists = favorites.some(fav => fav.id === movie.id);

  const updated = exists ? favorites.filter(fav => fav.id !== movie.id) : [...favorites, movie];

  saveFavorites(updated);
  return !exists;
}

let showingFavoritesOnly = false;

document.getElementById('favorite-toggle').addEventListener('click', () => {
  showingFavoritesOnly = !showingFavoritesOnly;
  document.getElementById('favorite-toggle').textContent = showingFavoritesOnly ? '전체보기' : '즐겨찾기';

  if (showingFavoritesOnly) {
    getMovies(getFavorites());
  } else {
    getMovies(popularMoviesCache);
  }
});

init();