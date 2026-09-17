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
  const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=ko-KR&page=1`);
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

function renderModalContent(movie) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '개봉일 미정';
  const genreNames = movie.genres.map(genre => genre.name).join(', ') || '장르 정보 없음';
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';

  movieModal.querySelector('.modal-poster').src = posterUrl;
  movieModal.querySelector('.modal-poster').alt = movie.title;
  movieModal.querySelector('.modal-title').textContent = movie.title;
  movieModal.querySelector('.modal-meta').textContent = `${year} · ${genreNames} · 평점 ${movie.vote_average.toFixed(1)}`;
  movieModal.querySelector('.modal-overview').textContent = movie.overview || '줄거리 정보가 없습니다.';
}

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
  const card = event.target.closest('.movie-card');
  if (!card) return;

  showMovieDetail(card.dataset.id);
});

function getMovies(movieArray) {
  const movieList = document.querySelector('.movie-list');

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
  renderMessage('불러오는 중...');

  try {
    const popularMovies = await fetchPopularMovies();
    getMovies(popularMovies.map(normalizeMovie));
  } catch (error) {
    console.error(error);
    renderMessage('영화 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
  }
}

async function fetchSearchMovies(keyword) {
  const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=ko-KR&query=${encodeURIComponent(keyword)}`);
  if (!response.ok) throw new Error('검색에 실패했습니다.');
  const data = await response.json();
  return data.results;
}

async function searchMovies(keyword) {
  const trimmed = keyword.trim();

  try {
    const results = trimmed ? await fetchSearchMovies(trimmed) : await fetchPopularMovies();
    getMovies(results.map(normalizeMovie));
  } catch (error) {
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

init();