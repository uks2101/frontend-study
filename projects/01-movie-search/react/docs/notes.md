# Project Notes (React)

vanilla 버전을 React로 재구현하면서 겪은 특이사항, 헷갈렸던 개념, 실제로 발생한 버그를 정리한다.

## Problems

### state를 바꿨는데 화면이 그대로였던 이유는?

- 처음엔 `movies`, `showingFavoritesOnly` 등을 그냥 일반 변수(`let`/`const`)로 두고 값만 바꿨더니 화면이 안 바뀜.
- React는 변수를 직접 감시하지 않는다. 컴포넌트가 "다시 그려져야 함"을 알려면 `useState`로 만든 값이어야 하고, 그 값을 바꿀 때도 반드시 `setState` 함수(`setMovies`, `setShowingFavoritesOnly` 등)를 통해야 한다.
- `setState`가 호출되면 그 컴포넌트 함수가 처음부터 다시 실행(리렌더링)되고, 이번엔 바뀐 값으로 JSX가 계산되어 화면에 반영된다.

### 배열/객체 state를 바꿀 때 원본을 직접 수정하면 안 되는 이유는?

- `movies.push(newMovie)`처럼 원본을 직접 수정하면 React가 "값이 바뀌었다"는 걸 감지 못 해 화면이 갱신이 안됨 (참조 자체는 그대로라서).
- `setMovies([...movies, newMovie])`, `favorites.filter(...)`처럼 **새 배열을 만들어서** `setState`에 넘겨야 함. vanilla의 `toggleFavorite`에서 쓰던 `[...favorites, movie]` / `filter(...)` 패턴을 그대로 가져다 씀.

### 컴포넌트 함수 안에서 바로 `fetch`를 호출하면 안 되는 이유는?

- 컴포넌트 본문은 렌더링될 때마다(= state가 바뀔 때마다) 매번 실행됨.
- 본문에서 바로 `fetch` → `setMovies` 하면 fetch가 끝나고 `setMovies`가 리렌더링을 유발하고, 그 리렌더링에서 다시 `fetch`가 실행되는 무한 루프에 빠짐.
- 그래서 "렌더링 밖에서 한 번/특정 조건에만 실행돼야 하는 작업"은 `useEffect`로 분리해야 함. vanilla의 `init()` 직접 호출 방식과 달리, React는 의존성 배열(`[]`, `[keyword]` 등)로 "언제 다시 실행할지"를 명시한다.

### `useEffect`가 개발 모드에서 두 번 실행되는 문제

- `main.jsx`의 `<StrictMode>`가 버그를 조기에 발견하려고 컴포넌트 마운트 시 effect를 일부러 한 번 더 실행(마운트 → 언마운트 → 재마운트)함.
- Network 탭에 요청이 2번 찍혀도 정상. 배포 빌드(`npm run build`)에서는 1번만 실행됨.
- 이 때문에 첫 번째 effect 실행분은 cleanup에서 바로 abort되는데, 이걸 실패로 착각해 `setLoading(false)`나 `setError(...)`를 호출하면 안 됨 → 아래 AbortError 처리와 연결됨.

### 실시간 검색 응답 순서 뒤바뀜(race condition)을 React에서 해결한 방식

- vanilla는 `currentController`라는 전역 변수에 이전 요청의 `AbortController`를 저장해두고, 새 검색 시작 시 직접 `abort()` 호출.
- React에서는 전역 변수가 필요 없음. `useEffect`의 **cleanup 함수**가 그 역할을 대신함.
  ```jsx
  useEffect(() => {
    const controller = new AbortController();
    // ... fetch(controller.signal) ...
    return () => controller.abort();   // 다음 effect 실행 직전(혹은 언마운트 시) 자동 호출
  }, [debouncedKeyword]);
  ```
- `debouncedKeyword`가 바뀌어 effect가 재실행되기 직전, React가 이전 effect의 cleanup(`controller.abort()`)을 먼저 실행해줌. 그래서 이전 요청이 자동으로 취소되고, 마지막 요청의 결과만 반영됨.
- `AbortError`는 "우리가 의도적으로 취소한 것"이므로 `catch`에서 `if (err.name === 'AbortError') return;`으로 걸러내고 별도 에러 처리를 하지 않아야 함(vanilla와 동일한 이유).

### `useDebounce` 커스텀 훅 원리

- vanilla의 `debounce(callback, delay)`는 `setTimeout`/`clearTimeout`을 클로저 변수로 관리했음.
- React에서는 "값이 바뀌고 일정 시간 뒤에 반영된 새 값을 돌려주는 훅"으로 재구성함.
  ```jsx
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const timerId = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(timerId);   // value가 다시 바뀌면 이전 타이머 취소
    }, [value, delay]);

    return debouncedValue;
  }
  ```
- 핵심은 "이벤트에 반응해서 함수를 호출"하던 vanilla 방식에서 "값이 바뀌면 effect가 실행된다"는 React 방식으로 사고 전환이 필요했다는 점. `keyword`가 바뀔 때마다 이 effect가 재실행되고, cleanup이 이전 타이머를 지워서 타이핑이 멈춘 뒤에만 값이 갱신됨.

### 카드 안에 있던 즐겨찾기 state를 `App`으로 옮긴 이유 (상태 끌어올리기)

- 처음엔 `MovieCard` 내부에 `useState`로 `isFavorite`을 관리했는데, 이러면 그 값이 카드 컴포넌트 안에서만 존재함.
- "즐겨찾기만 보기" 토글(부모), 이후 만든 상세 모달(다른 형제 컴포넌트)이 같은 즐겨찾기 정보를 알아야 했는데, 카드 내부 state로는 공유가 불가능함.
- 해결: 즐겨찾기 state(`favorites`)와 그걸 바꾸는 함수(`toggleFavorite`)를 공통 조상인 `App`(정확히는 `useFavorites` 훅)으로 옮기고, 각 카드/모달은 `props`로 값과 함수를 전달받아서 씀. React는 데이터가 항상 부모 → 자식으로만 흐르기 때문에, 여러 컴포넌트가 공유해야 하는 값은 그 컴포넌트들의 가장 가까운 공통 부모가 가져야 한다.

### 이벤트 위임 대신 `stopPropagation`을 쓴 이유

- vanilla는 카드가 검색할 때마다 `innerHTML = ''`로 통째로 다시 만들어지므로, 부모(`.movie-list`)에 리스너를 한 번만 걸고 `event.target.closest(...)`로 클릭된 카드를 식별하는 이벤트 위임을 썼음.
- React는 카드(`MovieCard`)마다 자기 버튼에 직접 `onClick`을 붙여도 리스너가 중복되거나 누적되는 문제가 없음(컴포넌트가 다시 그려질 때 이전 리스너는 알아서 정리됨). 그래서 위임이 필요 없음.
- 대신 카드 클릭(`onSelect`, 모달 열기)과 카드 안 즐겨찾기 버튼 클릭(`onToggleFavorite`)이 겹치는 문제(버블링)가 생겨서, 별 버튼 핸들러에서 `event.stopPropagation()`으로 부모(카드)의 `onClick`까지 이벤트가 전달되지 않도록 막아야 했음.

### JSX 작성 중 자주 틀린 문법들

- `class="..."` → `className="..."`을 써야 함. `class`를 그대로 쓰면 스타일이 전혀 안 먹히는데도 에러가 안 나서(콘솔 경고만 뜸) 원인 파악이 늦어짐.
- `<img ...>`, `<input ...>`처럼 HTML에서는 안 닫아도 되는 태그도 JSX에서는 반드시 `<img ... />`처럼 self-closing 해야 함. 안 그러면 이후 JSX 파싱이 깨짐.
- 컴포넌트 파일에 함수 선언 없이 JSX만 놓아두면 안 됨. 반드시 "대문자로 시작하는 함수 컴포넌트 안에서 `return`"하는 구조여야 함.
- `useState`/`useEffect`를 쓰면서 `import { useState } from 'react'` 등을 빠뜨려 `is not defined` 에러가 자주 발생함. 훅을 새로 쓸 때마다 import 확인 습관이 필요함.

### `addEventListener`/`removeEventListener`의 이벤트 이름 오타로 리스너가 안 지워진 버그

- ESC 키로 모달을 닫는 `useEffect`에서 `document.addEventListener('keydown', handleKeyDown)`으로 등록하고, cleanup에서 `document.removeEventListener('keyDown', handleKeyDown)`(대문자 D)으로 지우려 함.
- 이벤트 이름 문자열이 정확히 일치해야 같은 리스너로 인식되는데, `'keydown'` ≠ `'keyDown'`이라 **cleanup이 아무 효과 없이 조용히 실패**함. vanilla notes.md에 적어둔 "리스너가 계속 쌓이는" 버그와 원리가 같음. 대소문자 하나 차이로 발생해서 발견하기 까다로웠음.

### 조건부 렌더링에서 가드보다 먼저 값에 접근해 크래시가 난 버그 (`MovieModal`)

- 카드를 클릭한 직후엔 `selectedMovieId`는 있지만 상세 정보(`movieDetail`)는 아직 fetch 중이라 `null`인 순간이 반드시 존재함.
- `MovieModal` 컴포넌트에서 `posterUrl`, `year`, `genreNames` 같은 파생 값을 **`loading || !movie` 조건 분기보다 위, 즉 함수 최상단에서 무조건 계산**하도록 짜서, `movie`가 `null`인 상태에서 `movie.poster_path`에 접근하려다 `TypeError`가 발생.
- vanilla notes.md의 "에러 날 수 있는 코드가 try 블록 밖에 있어서 catch가 못 잡는다"는 버그와 같은 유형. React식으로 바꿔 말하면 "값이 없을 수 있는 상황을 먼저 체크하고, 그 체크를 통과한 뒤에만 그 값의 속성에 접근해야 한다"는 원칙.
- 해결: `showDetail = !loading && movie`처럼 먼저 안전 여부를 판단하는 변수를 만들고, 파생 값 계산도 `showDetail && movie.xxx` 형태로 단락 평가(short-circuit)해서 `movie`가 없을 때는 `movie.xxx`까지 평가가 진행되지 않도록 함.

### 같은 이름의 데이터(`movie`)라도 컴포넌트마다 모양(shape)이 다를 수 있음

- `MovieCard`가 받는 `movie`는 `normalizeMovie`를 거친 가공된 객체: `{ id, title, year, path }`. `path`는 이미 완전한 포스터 URL(또는 없으면 `null`).
- `MovieModal`이 받는 `movie`(=`movieDetail`)는 TMDB API의 **원본 응답 그대로**: `{ id, title, poster_path, release_date, genres, vote_average, overview, ... }`. `path`가 아니라 `poster_path`(상대 경로)이고, URL 조립을 직접 해야 함.
- `MovieModal`에서 포스터 URL을 만드는 코드를 그대로 복사해 `MovieCard`에 붙여넣었다가, `MovieCard`에서 정의된 적 없는 `showDetail` 변수를 참조하는 데다 애초에 `movie.poster_path` 자체가 `MovieCard`의 `movie`엔 없는 필드라 이중으로 잘못된 코드가 됨.
- 교훈: 같은 이름의 props라도 "이 컴포넌트가 실제로 받는 데이터가 어떤 모양인지"를 확인하지 않고 다른 컴포넌트의 코드를 그대로 복붙하면 안 됨.

### 커스텀 훅으로 로직을 분리할 때, 다른 훅이 소유한 state를 직접 건드리려던 실수

- `useMovieDetail` 훅으로 `movieDetail`/`setMovieDetail`을 캡슐화하고 `{ movieDetail, detailLoading }`만 반환하도록 정리했는데, `App.jsx`의 `handleCloseModal`에서 습관적으로 `setMovieDetail(null)`을 호출하려다 `setMovieDetail is not defined` 에러 발생. 이 setter는 훅 밖으로 노출된 적이 없었음.
- 해결 원칙: **state는 그 state를 만든 훅(또는 컴포넌트)이 소유하고 정리한다.** `App`이 `selectedMovieId`를 `null`로만 바꾸면, `useMovieDetail` 훅이 자기 `useEffect` 안에서 `selectedMovieId`가 없어졌음을 감지해 스스로 `movieDetail`을 비우도록 만듦.
  ```jsx
  useEffect(() => {
    if (!selectedMovieId) {
      setMovieDetail(null);   // 훅 내부에서 자기 state 정리
      return;
    }
    // ... fetch 로직
  }, [selectedMovieId]);
  ```
- 이렇게 하면 `App`은 다른 훅의 내부 구현을 몰라도 되고, 각 훅이 자기 책임 범위 안에서만 상태를 관리하게 됨.

### `useState`에 함수를 넘기는 이유 (lazy initializer)

- `useState(getFavorites())`처럼 **호출 결과**를 넘기면, 컴포넌트가 리렌더링될 때마다 `getFavorites()`가 매번 실행되어 불필요하게 `localStorage`를 반복해서 읽음.
- `useState(() => getFavorites())`처럼 **함수 자체**를 넘기면 React가 최초 렌더링 시 딱 한 번만 그 함수를 실행해서 초기값을 얻고, 이후 리렌더링에서는 실행하지 않음. `localStorage` 읽기처럼 비용이 있는 초기화 작업에 유효한 패턴.

### 폴더 구조: 로직(훅)과 화면(컴포넌트) 분리

- 초반엔 `App.jsx` 하나에 검색/즐겨찾기/모달 관련 state와 effect, JSX가 전부 몰려 있어 150줄 넘게 늘어남.
- `useFavorites`, `useMovies`, `useMovieDetail` 커스텀 훅으로 "상태 + effect" 로직을 분리하고, `SearchForm`, `MovieList` 컴포넌트로 "화면"을 분리한 뒤 `App.jsx`는 훅과 컴포넌트를 조립하는 역할만 남김.
- 이 구조에서는 각 훅/컴포넌트가 자기 데이터만 신경 쓰면 되고, `App.jsx`만 읽어도 "이 앱이 어떤 조각들로 구성되어 있고 데이터가 어떻게 오가는지"가 한눈에 들어옴.
