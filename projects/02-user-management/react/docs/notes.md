# Project Notes (React)

vanilla 버전(`projects/02-user-management/vanilla`)을 React로 재구현하면서 겪은 문제와 설계 판단 기록.

## Problems

### 훅 바깥에 선언한 함수가 `setMembers`를 못 찾는 문제

- `useMembers.js`에서 `addMember`/`updateMember`/`deleteMembers`를 `useMembers()` 함수 **바깥**(모듈 최상단)에 선언했는데, `setMembers`는 `useMembers()` **안에서** `useState`로 만들어지는 지역 변수라 바깥 함수들이 접근할 수 없었음.
- `generateId`/`loadMembers`는 매개변수만으로 동작하는 순수 함수라 바깥에 있어도 문제없었지만, `setMembers`처럼 클로저로 캡처해야 하는 값을 쓰는 함수는 그 값을 만들어낸 함수(`useMembers`) 안에 있어야 함.
- 테스트(호출)해보기 전까진 에러가 안 보여서 뒤늦게 발견 — `ReferenceError: setMembers is not defined`는 실제로 함수가 호출되는 시점에만 발생.
- 해결: 세 함수를 `useMembers()` 본문 안으로 이동.

### JSX 이벤트 핸들러 `onchange` vs `onChange`

- `<input onchange={handleChange} />`처럼 소문자로 썼더니, React가 인식하는 이벤트 prop이 아니라서 `change` 리스너가 전혀 연결되지 않음.
- 증상: `value`는 지정돼 있는데 타이핑이 안 먹히는 읽기 전용 필드처럼 동작 (React가 콘솔에 "`value` prop에 `onChange` 핸들러가 없다"는 경고를 띄움).
- JSX의 이벤트 핸들러 props는 전부 카멜케이스(`onChange`, `onClick`, `onSubmit`...)여야 함.

### React Compiler가 `useMemo`를 "메모이제이션 보존 불가"로 판단한 문제

- `App.jsx`에서 `toggleSelectAll` 함수를 52번째 줄쯤에 선언하고, 그 안에서 77번째 줄에 선언된 `visibleMembers`(useMemo 결과)를 참조함.
- 클로저 특성상 런타임 동작 자체는 문제없음(`toggleSelectAll`은 나중에 호출되므로 그 시점엔 `visibleMembers`가 이미 계산되어 있음) — 그런데 `eslint-plugin-react-hooks`의 `react-hooks/preserve-manual-memoization` 규칙(React Compiler 정적 분석)이 "뒤에 선언된 값을 앞에서 참조하는" 패턴을 안전하게 추적하지 못해서 `useMemo` 최적화를 포기(skip)해버림.
- 해결: `useMemo`로 계산하는 파생값(`visibleMembers`)을 그걸 사용하는 함수들보다 **먼저**(state 선언 바로 다음) 선언하도록 순서를 조정.
- vanilla에서 `const selectedIds = new Set()`를 `renderRow`보다 늦게 선언해서 TDZ `ReferenceError`가 났던 것과 결이 비슷한 교훈: "파생 상태는 위에, 그걸 쓰는 로직은 아래에."

## 설계 결정

### `useMembers` 훅으로 데이터 로직 캡슐화

- vanilla는 `members` 배열을 바꿀 때마다 `saveMembers(members)`를 직접 호출해야 했음(인자를 빠뜨려서 localStorage가 `"undefined"` 문자열로 오염된 사건도 있었음).
- React에서는 `useState`로 `members`를 관리하고, `useEffect(() => { localStorage.setItem(...) }, [members])`로 "state가 바뀌면 자동 저장"되게 만들어서, CRUD 함수들이 저장을 깜빡할 걱정이 없어짐.
- `addMember`/`updateMember`/`deleteMembers`는 전부 `setMembers((prev) => ...)` 형태의 **함수형 업데이트**를 사용 — React의 불변성 원칙(배열/Set을 직접 변경하지 않고 항상 새로 만들어서 교체) 때문. vanilla의 `members.push(...)`, `selectedIds.add(...)` 같은 직접 변경(mutate) 방식은 React state에는 그대로 못 씀.

### 모달을 "열기/닫기"가 아니라 "마운트/언마운트"로 구현

- vanilla는 모달 DOM을 항상 그려두고 `hidden` 속성 + CSS로 보이기/숨기기를 전환했음 (그래서 `[hidden]`과 id 선택자 specificity 충돌 버그도 겪음).
- React에서는 `{isModalOpen && <MemberFormModal ... />}`로 조건부 렌더링해서, `false`일 땐 컴포넌트 자체가 언마운트되고 `true`가 되면 새로 마운트됨.
- 이 방식의 장점: 모달을 다시 열 때마다 `useState`의 초기값(`editingMember?.name ?? ''` 등)이 그 시점 props 기준으로 새로 계산돼서, vanilla처럼 `openEditModal`에서 `memberNameInput.value = member.name`으로 기존 DOM을 수동으로 덮어쓸 필요가 없어짐. 폼이 "항상 깨끗한 상태로 다시 그려진다"는 걸 React의 마운트/언마운트 생명주기에 맡긴 것.
- 부수 효과로, `[hidden]` CSS specificity 문제 자체가 발생할 여지가 없어짐 (안 보일 땐 DOM에 아예 없으니까).

### 이벤트 위임 대신 각 요소에 직접 핸들러 연결

- vanilla는 `<tbody>`가 `innerHTML`로 통째로 다시 그려지는 구조라, 이벤트 위임(`#member-list`에 리스너 하나만 걸고 `closest()`로 대상 찾기)이 필수였음.
- React는 각 `MemberRow`에 `onClick={() => onEdit(member)}`처럼 직접 핸들러를 연결해도 리스너 중복/누락 문제가 없음 — Virtual DOM diffing이 리렌더링마다 리스너를 다시 걸지 않고 필요한 부분만 갱신해주기 때문. `key={member.id}`를 각 행에 지정해서 React가 "어떤 항목이 어떤 항목인지" 정확히 추적하게 해준 것도 이 안정성에 기여.

### `useDebounce(value, delay)` — "함수 지연"에서 "값 지연"으로

- vanilla의 `debounce(fn, delay)`는 함수 호출 자체를 지연시키는 방식.
- React 버전은 "값"을 지연시키는 패턴(`useDebounce`)을 씀: 인풋에 보여줄 값(`searchInput`, 즉시 반영)과 실제 필터링에 쓸 값(`debouncedSearch`, 지연 반영)을 분리. `useEffect`의 cleanup(`clearTimeout`)이 "이전 타이머 취소"를 담당 — 이게 없으면 타이핑 중 걸린 이전 타이머들이 전부 살아남아 엉뚱한 시점에 값이 바뀌는 문제가 생김.

### 전체선택을 `visibleMembers` 기준으로 변경 (vanilla 동작 개선)

- vanilla는 전체선택 체크박스를 누르면 검색/필터로 가려진 회원까지 포함한 **전체** `members`를 선택했음 (화면에 안 보이는 회원도 선택되는, 의도치 않았을 가능성이 높은 동작).
- React 버전은 `toggleSelectAll`이 `visibleMembers`(현재 검색/필터 적용된 목록) 기준으로 선택하도록 만들어서, "보이는 것만 선택"되게 동작을 수정함.

### CSS 선택자: id 순서 기반 대신 명시적 className

- vanilla는 `:first-of-type`/`:last-of-type` 같은 순서 기반 선택자로 버튼 색을 구분했는데, React 버전은 `.btn-primary`/`.btn-danger`/`.btn-save`/`.btn-cancel`처럼 명시적 className을 부여함. DOM 순서가 바뀌어도 스타일이 깨지지 않는 더 안전한 방식.
