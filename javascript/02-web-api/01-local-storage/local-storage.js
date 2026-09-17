// 1. 기본 사용법
localStorage.setItem("username", "kim");
console.log(localStorage.getItem("username")); // "kim"
console.log(localStorage.getItem("nonExist")); // null

localStorage.removeItem("username");
console.log(localStorage.getItem("username")); // null

// 2. length / key
localStorage.setItem("a", "1");
localStorage.setItem("b", "2");
console.log(localStorage.length); // 2
console.log(localStorage.key(0)); // "a"

// 3. 객체 저장하기 (JSON 직렬화)
const user = { name: "kim", age: 20 };
localStorage.setItem("user", JSON.stringify(user));

const savedUser = JSON.parse(localStorage.getItem("user") ?? "null");
console.log(savedUser?.name); // "kim"

// 4. 배열 저장하기
const favorites = ["apple", "banana"];
localStorage.setItem("favorites", JSON.stringify(favorites));
console.log(JSON.parse(localStorage.getItem("favorites"))); // ["apple", "banana"]

// 5. 전체 삭제
localStorage.clear();
console.log(localStorage.length); // 0

// 6. storage 이벤트 (다른 탭에서 값이 바뀔 때 감지)
window.addEventListener("storage", (event) => {
  console.log(event.key, event.oldValue, event.newValue);
});

// 7. 용량 초과 예외 처리
try {
  localStorage.setItem("bigData", "x".repeat(10 * 1024 * 1024));
} catch (error) {
  console.log("저장 실패:", error.name); // QuotaExceededError
}
