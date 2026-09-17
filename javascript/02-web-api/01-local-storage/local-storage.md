# 로컬 스토리지 (localStorage)

## 1. 개념

- 브라우저에 key-value 형태로 데이터를 저장하는 웹 스토리지(Web Storage) API 중 하나.
- 값은 문자열(string)로만 저장됨 (객체/배열은 JSON.stringify로 변환 후 저장).
- 저장 용량은 도메인당 약 5~10MB (브라우저마다 상이).

* 참고
- 같은 브라우저라도 프로토콜/도메인/포트가 다르면 별개의 저장소로 취급 (Origin 단위).

## 2. sessionStorage와의 차이

| 구분 | localStorage | sessionStorage |
|---|---|---|
| 유지 기간 | 명시적으로 삭제하기 전까지 영구 보관 | 탭/창을 닫으면 삭제 |
| 공유 범위 | 같은 출처의 모든 탭/창에서 공유 | 탭(세션) 단위로 독립 |

## 3. 주요 메서드

- setItem(key, value) : 데이터 저장 (기존 key면 덮어씀)
- getItem(key) : 데이터 조회, 없으면 null 반환
- removeItem(key) : 특정 key 삭제
- clear() : 전체 삭제
- key(index) : index 번째 key 이름 반환
- length : 저장된 항목 개수

## 4. 객체/배열 저장하기

- localStorage는 문자열만 저장 가능하므로 객체나 배열은 JSON.stringify로 직렬화해서 저장.
- 꺼내 쓸 때는 JSON.parse로 역직렬화.

* 참고
- getItem 결과가 null일 수 있으므로 JSON.parse(null)이 되지 않도록 값 존재 여부를 먼저 확인.

## 5. storage 이벤트

- 다른 탭/창에서 localStorage 값이 변경되면 window에서 'storage' 이벤트 발생.
- 값을 변경한 탭 자기 자신에게는 발생하지 않고, 같은 출처의 "다른" 문서에서만 감지됨.
- event.key, event.oldValue, event.newValue, event.storageArea 로 변경 내용 확인 가능.

## 6. 주의사항

- 용량 초과 시 QuotaExceededError 예외 발생 → try/catch로 처리.
- 민감한 정보(비밀번호, 토큰 등)는 저장하지 않는 것이 안전 (XSS에 취약, 암호화되지 않음).
- 동기(synchronous) API라서 대용량 데이터를 자주 다루면 성능에 영향을 줄 수 있음.