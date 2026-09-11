const movies = [
  {
    id: 1,
    title: '파묘',
    year: 2024,
    path: 'image/movie-poster-01.jpeg'
  },
  {
    id: 2,
    title: '범죄도시3',
    year: 2023,
    path: 'image/movie-poster-02.jpeg'
  },
  {
    id: 3,
    title: '검은 사제들',
    year: 2015,
    path: 'image/movie-poster-03.jpeg'
  },
  {
    id: 4,
    title: '남산의 부장들',
    year: 2020,
    path: 'image/movie-poster-04.jpeg'
  },
  {
    id: 5,
    title: '백두산',
    year: 2019,
    path: 'image/movie-poster-05.jpeg'
  },
  {
    id: 6,
    title: '범죄와의 전쟁',
    year: 2012,
    path: 'image/movie-poster-06.jpeg'
  },
  {
    id: 7,
    title: '1987',
    year: 2017,
    path: 'image/movie-poster-07.jpeg'
  },
  {
    id: 8,
    title: '비상선언',
    year: 2022,
    path: 'image/movie-poster-08.jpeg'
  },
  {
    id: 9,
    title: '부산행',
    year: 2016,
    path: 'image/movie-poster-09.jpeg'
  },
  {
    id: 10,
    title: '독전',
    year: 2018,
    path: 'image/movie-poster-10.jpeg'
  }
];

function getMovies(movieArray) {
  const movieList = document.querySelector('.movie-list');

  if(!movieList) {
    console.error('movie-list 요소를 찾을 수 없습니다.');
    return;
  }

  movieList.innerHTML = '';

  movieArray.forEach(movie => {
    const card = document.createElement('li');
    card.classList.add('movie-card');

    const postUrl = movie.path

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

getMovies(movies);