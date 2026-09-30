const STORAGE_KEY = 'user-management:members';

const STATUS_LABEL = {
  active: '활성',
  inactive: '휴면',
};

const SEED_MEMBERS = [
  { name: '김민준', email: 'minjun.kim@example.com', phone: '010-1234-5678', joinedAt: '2024-03-02', status: 'active' },
  { name: '이서연', email: 'seoyeon.lee@example.com', phone: '010-2345-6789', joinedAt: '2024-05-14', status: 'active' },
  { name: '박도윤', email: 'doyoon.park@example.com', phone: '010-3456-7890', joinedAt: '2023-11-27', status: 'inactive' },
  { name: '최지아', email: 'jia.choi@example.com', phone: '010-4567-8901', joinedAt: '2025-01-09', status: 'active' },
  { name: '정하윤', email: 'hayoon.jung@example.com', phone: '010-5678-9012', joinedAt: '2024-08-21', status: 'inactive' },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{1,2}-\d{3,4}-\d{4}$/;

const SEARCH_DEBOUNCE_DELAY = 300;
