# Project Notes

## Problems

### 실시간 검색에서 debounce 를 사용한 이유? 왜 그냥 input 이벤트만 걸면 안되지?

- 그냥 input 이벤트를 걸면 글자마다 함수가 실행되고, DOM 을 통째로 다시 그리게 됨. 따라서 타이핑이 잠깐 멈췄을 때만 검색 실행하는 디바운스 사용.

### throttle 과 debounce 중 debounce 를 사용한 이유는?

- 이벤트 실행 빈도를 줄인다는 목적은 같음.
throttle 은 일정 시간 간격마다 무조건 한 번씩 실행 -> 스크롤, 리사이즈, 마우스무브 처럼 이벤트가 끊임없이 발생하고 그 와중에도 화면을 계속 갱신해야하는 경우에 적합.
debounce 는 이벤트가 멈추고나서 지정한 시간이 지나야 딱 한 번 실행 -> 검색어 입력, 창 리사이즈 후 레이아웃 재계산 등에 적합.

### 상세보기 모달에서 카드 클릭 감지에 이벤트 위임(event delegation)을 쓴 이유는?

- 카드는 검색할 때마다 `movieList.innerHTML = ''`로 지워지고 다시 만들어짐. 카드 하나하나에 리스너를 걸면 매번 다시 걸어줘야 해서 번거롭고, 빠뜨리기 쉬움.
- `.movie-list`(부모 요소)는 검색해도 사라지지 않으므로, 부모에 클릭 리스너를 한 번만 걸고 클릭이 버블링되는 걸 잡음. `event.target.closest('.movie-card')`로 실제 클릭된 카드를 찾아 어떤 영화인지 식별.

### hidden 어트리뷰트를 줬는데 모달이 처음부터 보이는 문제

- `hidden` 어트리뷰트는 브라우저 기본 스타일(`[hidden] { display: none; }`)로 숨겨지는데, `.modal { display: flex; }`처럼 직접 display를 지정하면 동일한 우선순위(specificity)에서 나중에 로드되는 우리 CSS가 이겨버려 hidden이 무시됨.
- `.modal[hidden] { display: none; }`을 추가로 명시해서 다시 덮어써야 함. display를 직접 지정하는 요소에 hidden을 같이 쓸 때 항상 주의.

### 모달 버그 1 - try 블록 밖에서 에러가 나면 catch가 못 잡음

- `showMovieDetail` 함수에서 `.movie-overview`라는 오타(실제로는 `.modal-overview`)로 `querySelector` 결과가 null이 되고, null에 `.textContent`를 대입하려다 TypeError 발생.
- 이 코드가 `try` 블록 "바깥"에 있어서 catch로 못 잡히고 함수가 그 자리에서 죽어버림 -> fetch 호출까지 아예 도달을 못 함.
- 에러가 날 수 있는 코드는 반드시 try 블록 안에 있어야 catch가 의미가 있음.

### 모달 버그 2 - 렌더링 함수 안에서 이벤트 리스너를 등록하면 호출될 때마다 중복됨

- `getMovies` 함수 안에 `movieList.addEventListener('click', ...)`를 넣어뒀는데, `getMovies`는 검색/초기로딩마다 반복 호출되는 함수라 호출될 때마다 리스너가 계속 쌓임.
- `movieList` DOM 엘리먼트 자체는 안 바뀌고 innerHTML만 갈아끼우기 때문에 이전에 등록한 리스너가 사라지지 않고 누적됨.
- 증상: 검색을 여러 번 한 뒤 카드를 클릭하면 클릭 한 번에 fetch가 여러 번(검색한 횟수만큼) 나감.
- 해결: 리스너 등록 코드를 렌더링 함수 밖으로 빼서, 페이지 로드 시 딱 한 번만 실행되도록 분리.