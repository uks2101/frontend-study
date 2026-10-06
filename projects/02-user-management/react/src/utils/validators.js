const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{1,2}-\d{3,4}-\d{4}$/;

export function validateForm(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = '이름을 입력해주세요.';
  }

  if (!values.email.trim()) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = '이메일 형식이 올바르지 않습니다.';
  }

  if (!values.phone.trim()) {
    errors.phone = '전화번호를 입력해주세요.';
  } else if (!PHONE_REGEX.test(values.phone.trim())) {
    errors.phone = '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)';
  }

  if (!values.joinedAt) {
    errors.joinedAt = '가입일을 선택해주세요.';
  }

  return errors;
}