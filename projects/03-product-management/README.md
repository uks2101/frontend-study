# SHOP: 상품 관리 서비스

상태 관리 · 복합 UI · 비동기 처리를 **직접 구현한 뒤 라이브러리로 리팩터링**하며 학습한 쇼핑몰/관리자 프로젝트입니다.

**데모**: https://frontend-study-delta.vercel.app

> 백엔드 없이 [MSW](https://mswjs.io)로 만든 가짜 서버가 브라우저 안에서 동작합니다. 관리자 화면에서 상품을 등록·수정·삭제할 수 있고, 새로고침하면 초기 데이터로 돌아갑니다.

## 핵심 포인트

### 1. 직접 만들고 → 라이브러리로 교체
|  | 1부: 직접 구현 | 2부 : 라이브러리 |
|---|---|---|
| 서버 상태 | `useQuery`, `useInfiniteQuery`, `useMutation`, 캐시 (250줄) | Tanstack Query |
| 전역 상태 | Context + `useReducer`, `useSyncExternalStore`, 스토어 (164줄) | Zustand |

직접 구현할 떄부터 라이브러리와 **같은 인터페이스**(`queryKey`, `queryFn`, `onMutate` 등)로 설계해서, 교체할 때 페이지 컴포넌트는 거의 수정하지 않았습니다.
→ 자세한 비교: [docs/notes.md](./docs/notes.md)

### 2. 비동기 처리
- `AbortController`로 요청 취소 (StrictMode 중복 요청, 검색 레이스 컨디션)
- `staleTime` 캐시 + stale-while-revalidate, 필터 변경 시 이전 데이터 유지
- 무한 스크롤 (`IntersectionObserver`), 뒤로 가기 시 불러온 목록과 스크롤 위치 복원
- **낙관적 업데이트**: 삭제·재고 수정을 즉시 반영하고, 실패하면 롤백 (동시 수정 시 조건부 롤백)

### 3. 복합 UI
- 필터·정렬·검색 상태를 **URL에 저장** (새로고침, 공유, 뒤로 가기 지원)
- 관리자 테이블: 번호 페이지네이션, 열 정렬, 다중 선택 삭제, 인라인 재고 수정
- 등록/수정 폼: 유효성 검사, 이미지 미리보기, 작성 중 이탈 방지
- `<dialog>` 기반 확인 창과 모바일 필터 Drawer

### 4. 접근성 · 사용성
- 키보드 조작, 포커스 관리, 스크린리더용 ARIA (`aria-pressed`, `aria-sort`, `aria-live` 등)
- 다크 모드 (시스템 설정 연동, 새로고침 깜빡임 방지)
- 본문 바로가기, `prefers-reduced-motion` 대응

## 기능

**쇼핑몰**: 상품 목록 (검색/카테고리/가격/정렬, 그리드·리스트 보기, 무한 스크롤) · 상품 상세 (갤러리, 수량, 관련 상품) · 장바구니 (재고 제한, 선택 결제 금액, 삭제 실행 취소) · 찜하기 · 최근 본 상품

**관리자**: 상품 목록 (페이지네이션, 정렬, 검색) · 등록/수정 · 삭제 (단일/일괄) · 인라인 재고 수정

## 기술 스택

React 19 · React Router 8 · TanStack Query 5 · Zustand 5 · MSW 3 · Vite

## 폴더 구조

```
src/
├── api/          # fetch 공통 함수(ApiError), 상품 API
├── mocks/        # MSW 핸들러(필터·정렬·페이지네이션), 가짜 DB
├── lib/          # QueryClient 설정
├── store/        # Zustand 스토어 (장바구니, 찜, 최근 본 상품, 테마, 토스트)
├── hooks/        # 데이터 훅, URL 필터 훅, 공용 훅
├── components/   # common / product / product-detail / filter / cart / admin
├── pages/        # 라우트 단위 화면
└── utils/        # 가격 계산, 필터 ↔ URL 변환, 폼 검증
```

## 실행 방법

```bash
npm install
npm run dev
```

### 에러 상황 테스트
브라우저 콘솔에서 가짜 서버의 응답을 바꿀 수 있습니다.
```js
localStorage.setItem('mock:scenario', 'error')          // 목록 조회 실패
localStorage.setItem('mock:scenario', 'empty')          // 빈 목록
localStorage.setItem('mock:scenario', 'mutation-error') // 저장/삭제 실패 (롤백 확인)
localStorage.removeItem('mock:scenario')                // 원래대로
```

## 개발 과정

| 단계 | 커밋 |
|---|---|
| 세팅, 목록, 로딩/에러 상태 | `90435f2` `a8bd9b8` |
| 직접 만든 useQuery (취소, 캐시) | `1bbaf8d` |
| 필터·정렬·검색 + URL 동기화 | `1dafede` |
| 무한 스크롤 | `3d2a467` |
| 상세 페이지 | `d6a49a2` |
| 장바구니 (Context + useReducer) | `2f326ca` |
| 토스트 | `4b307eb` |
| 관리자 테이블, 폼 | `d6b78c4` `72c4c94` |
| 낙관적 업데이트 | `9e57652` |
| 찜, 최근 본 상품, 다크 모드, Drawer, 접근성 | `0910f81` `039d271` |
| **Zustand 리팩터링** | `0d6d78e` |
| **TanStack Query 리팩터링** | `8dfe24e` |
