# Project Notes

## Problems

### `hidden` 어트리뷰트를 줬는데 모달이 안 닫히는 문제

- `#member-modal { display: flex; }`처럼 id 선택자로 직접 display를 지정하면, 브라우저 기본 스타일 `[hidden] { display: none; }`(속성 선택자)보다 id 선택자의 우선순위(specificity)가 더 높아서 `hidden` 속성이 무시됨.
- `memberModal.hidden = true`로 JS는 제대로 동작해도, CSS가 이겨버려서 화면상으로는 안 닫힌 것처럼 보임.
- `#member-modal[hidden] { display: none; }`을 추가해서 다시 덮어써야 함. movie-search 때 `.modal[hidden]`으로 겪었던 것과 동일한 패턴.

### `const`로 선언한 변수를 선언 전에 참조해서 난 `ReferenceError`

- `renderRow` 함수 안에서 `selectedIds.has(member.id)`를 쓰는데, `const selectedIds = new Set();` 선언이 파일 아래쪽(다중 선택 삭제 기능 작성 시점)에 있었음.
- `renderRow`는 페이지 로드 시점에 `renderMembers()`를 통해 이미 호출되는데, 이 시점엔 아직 `selectedIds` 선언문이 실행되기 전이라 `ReferenceError: Cannot access 'selectedIds' before initialization` 발생.
- `const`/`let`은 스코프 전체에 선언 자체는 호이스팅되지만, 실제 선언문이 실행되기 전까지는 접근이 금지된 구간(TDZ, Temporal Dead Zone)에 놓임. `var`처럼 `undefined`로 초기화된 채 접근 가능한 게 아님.
- 해결: 상태로 쓰는 변수(`selectedIds` 등)는 그걸 사용하는 함수보다 먼저, 파일 위쪽에 몰아서 선언.

### 화살표 함수 블록 바디에서 `return`을 빠뜨려서 배열이 전부 `undefined`가 된 문제

- `members.map((member) => { member.id === editingId ? {...} : member })`처럼 화살표 함수를 `{ }`(블록 바디)로 쓰면, 안에서 값을 돌려주려면 반드시 `return`을 명시해야 함. 없으면 `map()` 결과는 `[undefined, undefined, ...]`.
- `renderMembers` 최초 작성 때, 그리고 수정 기능(`handleFormSubmit`의 map)에서 동일한 실수를 두 번 반복함.
- 중괄호 없는 concise body(`(member) => 식`)를 쓰면 자동으로 반환되니, 한 줄짜리 삼항연산자는 이 방식이 실수를 줄여줌.

### `JSON.stringify`가 배열 속 `undefined`를 `null`로 바꿔서 localStorage가 오염된 문제

- 위 `return` 누락 버그가 있던 상태로 "수정 저장"을 실행하면, `members`가 `[undefined, undefined, ...]`가 되고 바로 `saveMembers(members)`가 호출됨.
- `JSON.stringify`는 배열 안의 `undefined` 원소를 `null`로 변환하는 규칙이 있어서, localStorage엔 `"[null,null,null,null,null]"`이 그대로 저장됨.
- 이후 `return` 버그를 고쳐도, localStorage에 남은 손상 데이터는 저절로 복구되지 않음. `loadMembers()`가 `raw !== null`이라 재시딩을 안 타고 `JSON.parse`로 손상 데이터를 그대로 불러오다가, `renderRow(null)` 호출 시 `null.id` 접근에서 `TypeError` 발생.
- 코드를 고친 뒤에도 목록이 안 보이면, 코드가 아니라 **저장된 데이터 자체가 오염됐을 가능성**을 의심해야 함. `localStorage.removeItem(키)`로 지우고 새로고침하면 재시딩됨.

### `saveMembers()`를 인자 없이 호출해서 같은 증상이 재발한 문제

- `deleteSelectedMembers()`에서 `saveMembers(members)`가 아니라 `saveMembers()`로 인자를 빠뜨림.
- `list` 파라미터가 `undefined`가 되고, `JSON.stringify(undefined)`는 문자열이 아니라 `undefined` 자체를 반환. `localStorage.setItem`은 두 번째 인자를 강제로 문자열화하므로 결국 `"undefined"`라는 글자 그대로의 문자열이 저장됨.
- 다음 로드 때 `JSON.parse("undefined")`는 **SyntaxError**를 던지고, `catch` 블록이 이를 잡아 빈 배열(`[]`)을 반환 — 회원 목록이 통째로 사라지는 증상으로 나타남.
- 함수 호출 시 필수 인자를 빠뜨리면 조용히 `undefined`로 처리되고 마는 경우가 많아서, 실행 시점엔 에러가 안 나고 한참 뒤(다음 로드 시점)에야 증상이 드러남 — 원인 추적이 헷갈리는 유형.

### `confirm()`의 반환값을 안 받아서 "취소"를 눌러도 삭제되던 문제

- `deleteMember`, `deleteSelectedMembers` 최초 작성 시 `confirm(메시지)`만 호출하고 반환값을 변수에 담지 않음.
- `confirm()`은 "확인"/"취소" 여부를 `true`/`false`로 **반환하는 함수**인데, 반환값을 버리면 그 다음 줄(삭제 로직)이 사용자의 선택과 무관하게 항상 실행됨.
- `const confirmed = confirm(...); if (!confirmed) return;` 형태로 반환값을 받아 조건 분기해야 함.

### 구조 분해 할당 대상을 잘못 짚은 문제

- `const { id } = checkbox.dataset.id;` — `checkbox.dataset.id`는 이미 문자열 값(예: `"abc-123"`)인데, 문자열에서 `{ id }`로 구조 분해하면 `"abc-123".id`(존재하지 않는 속성)를 찾아서 결과가 `undefined`가 됨.
- `dataset` **객체 자체**에서 구조 분해해야 함: `const { id } = checkbox.dataset;`

### `=`(대입)와 `===`(비교)를 혼동해서 삭제 버튼이 항상 수정으로 처리된 문제

- `if (actionBtn.dataset.action = 'edit')`처럼 조건문에 대입 연산자를 씀. 대입식은 대입한 값(`'edit'`, truthy)을 그대로 반환하기 때문에 이 조건은 항상 참이 되어버림.
- 결과적으로 삭제 버튼을 눌러도 첫 번째 `if`(수정)가 항상 먼저 걸려서 삭제 분기(`else if`)가 실행되지 않음.
- `===`로 비교해야 함. 대입과 비교를 헷갈리는 실수는 컴파일 에러 없이 조용히 로직만 깨뜨려서 특히 찾기 까다로움.

### 정규식에서 `.`을 이스케이프하지 않아 이메일 형식 검증이 헐거웠던 문제

- `EMAIL_REGEX`를 `/^[^\s@]+@[^\s@].[^\s@]+$/`로 작성 — `.`을 이스케이프(`\.`) 하지 않으면 정규식에서 "아무 문자 하나"를 뜻하는 와일드카드로 동작해서, 점이 아닌 문자가 들어가도 통과됨.
- `@` 뒤 `[^\s@]`에 `+`도 빠져서 도메인 앞부분이 한 글자만 허용되는 문제도 같이 있었음.
- `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`로 수정. 정규식에서 리터럴 마침표를 쓸 땐 항상 이스케이프를 의식적으로 체크할 것.

### 전체선택 체크박스를 눌러도 "선택 삭제" 버튼이 활성화 안 되던 문제

- 개별 체크박스 `change` 리스너에서는 `updateDeleteSelectedButton()`을 호출하는데, 전체선택 체크박스 리스너에서는 이 호출이 빠져있었음.
- `selectedIds`엔 id가 다 채워져도, 버튼의 `disabled` 속성은 `updateDeleteSelectedButton()`이 호출될 때만 갱신되는 별개의 상태라 자동으로 따라오지 않음.
- 상태를 갱신하는 함수가 여러 이벤트 핸들러에서 공통으로 필요하다면, 빠뜨리기 쉬우니 관련 상태가 바뀌는 모든 지점에서 호출되는지 체크리스트처럼 확인할 것.

## 설계 결정

### 이벤트 위임을 다시 사용한 이유

- 회원 목록(`<tbody>`)은 검색/필터/정렬/CRUD 때마다 `innerHTML`로 통째로 다시 그려짐. movie-search 때와 같은 이유로, 각 행의 수정/삭제 버튼과 체크박스에 개별 리스너를 걸면 렌더링마다 리스너가 사라지거나 중복 등록됨.
- `#member-list`(부모, 렌더링해도 사라지지 않는 요소)에 `click`/`change` 리스너를 한 번만 걸고, `event.target.closest('[data-action]')` / `event.target.closest('.row-checkbox')`로 실제 클릭/변경된 대상을 찾아 처리.

### 검색에 debounce를 재사용한 이유

- movie-search 때와 동일하게, 입력할 때마다 바로 필터링하면 타이핑 중에도 계속 재렌더링이 일어남. 입력이 멈추고 일정 시간(`SEARCH_DEBOUNCE_DELAY`, 300ms) 지난 뒤 한 번만 검색어를 반영하도록 debounce 적용.

### 선택된 회원 id를 배열 대신 `Set`으로 관리한 이유

- 다중 선택 삭제 기능에서 "선택됐는지 확인(`has`)", "추가(`add`)", "제거(`delete`)"를 자주 하는데, 배열로 하면 매번 `includes`/`indexOf`로 순회 탐색해야 함. `Set`은 이 세 연산이 더 간결하고, 같은 id가 중복으로 들어갈 걱정도 없음.

### 등록/수정 폼을 하나로 합친 이유

- 모달과 폼(`#member-modal`, `#member-form`)을 등록/수정 공용으로 재사용. `<input type="hidden" id="member-id">`에 "지금 수정 중인 회원의 id"를 담아두고, 이 값의 존재 여부로 `handleFormSubmit`에서 등록(`push`)과 수정(`map`으로 해당 id만 교체)을 분기.
- 폼을 두 개 따로 만드는 대신, 여는 시점(`openAddModal` vs `openEditModal`)에서 hidden input 값과 나머지 인풋 값을 다르게 채워 넣는 방식으로 중복을 줄임.
