import { getResponse } from 'msw';
import { handlers } from './handlers';

export function mockFetch(input, init = {}) {
  const { signal } = init;

  return new Promise((resolve, reject) => {
    const abort = () => reject(new DOMException('요청이 취소되었습니다.', 'AbortError'));
    if (signal?.aborted) return abort();
    signal?.addEventListener('abort', abort, { once: true });

    const request = new Request(new URL(input, window.location.origin), init);
    getResponse(handlers, request)
      .then((response) => resolve(response ?? fetch(input, init)))
      .catch(reject);
  });
}