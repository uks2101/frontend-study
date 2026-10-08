import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export default function LoadMore({ hasNextPage, isFetching, error, onLoadMore }) {
  const targetRef = useIntersectionObserver(onLoadMore, {
    enabled: hasNextPage && !isFetching && !error
  });

  if (!hasNextPage) {
    return <p className="load-more load-more--end">모든 상품을 불러왔습니다.</p>;
  }

  return (
    <div ref={targetRef} className="load-more">
      {isFetching && <p role="status">상품을 더 불러오는 중...</p>}

      {error && (
        <div role="alert">
          <p>{error.message}</p>
          <button type='button' className="btn" onClick={onLoadMore}>다시 시도</button>
        </div>
      )}

      {!isFetching && !error && (
        <button type='button' className="btn" onClick={onLoadMore}>더 보기</button>
      )}
    </div>
  )
}