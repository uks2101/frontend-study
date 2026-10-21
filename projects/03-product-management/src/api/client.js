import { mockFetch } from '../mocks/mockFetch';

const fetcher = import.meta.env.PROD ? mockFetch : (...args) => fetch(...args);

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request(url, { body, headers, ...options } = {}) {
  const init =
    body === undefined
      ? { ...options, headers }
      : {
          ...options,
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json', ...headers },
        };

  let res;
  try {
    res = await fetcher(url, init);
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('네트워크 연결을 확인해주세요.', 0);
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(data?.message ?? '요청에 실패했습니다.', res.status);
  }

  if (res.status === 204) return null;

  if (!res.headers.get('Content-Type')?.includes('application/json')) {
    throw new ApiError('서버 응답 형식이 올바르지 않습니다.', res.status);
  }

  return res.json();
}
