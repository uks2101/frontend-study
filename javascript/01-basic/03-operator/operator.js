let num = 7;
let result = (num % 2 === 0) ? "짝수" : "홀수";
console.log(result);

let isLoggedIn = true;
let message = isLoggedIn ? "환영합니다" : "로그인이 필요합니다.";
console.log(message);

const user = {
  name : undefined,
  address : "대전"
};
console.log(user?.name ?? '손님');

// 옵셔널 체이닝을 null 병합 연산자와 함께 쓰면 기본값을 지정하기 좋음.