# 데이터 타입

## 1. 데이터 타입이란?

프로그래밍 언어에서 사용할 수 있는 데이터 (숫자, 문자열, 불리언 등)의 종류.

## 2. 원시 타입 (Primitive Type)

* 변경 불가능한 값 (Immutable Value)
* 값에 의한 전달 (pass-by-value)

- String
- Number
- Boolean
- Null
- Undefined
- BigInt
- Symbol

* 특이사항 : typeof null 이 object 를 반환하는 이유는 초기 구현 당시 버그 때문.
따라서 일치 연산자 (===)를 사용하여 직접 비교하여야 한다.

## 3. 객체 타입 (Object/Reference Type)

* 식별자로 참조할 수 있는 메모리에 있는 값
* 값 자체는 복사되지 않고 객체 참조

- Object