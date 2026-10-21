const PAGE_WINDOW = 5;

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const start = Math.max(
    1,
    Math.min(page - Math.floor(PAGE_WINDOW / 2), totalPages - PAGE_WINDOW + 1),
  );
  const end = Math.min(totalPages, start + PAGE_WINDOW - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="pagination__button"
        aria-label="이전 페이지"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        &lt;
      </button>

      {start > 1 && (
        <>
          <button
            type="button"
            className="pagination__button"
            aria-label="1페이지"
            onClick={() => onChange(1)}
          >
            1
          </button>
          {start > 2 && (
            <span className="pagination__ellipsis" aria-hidden="true">
              ...
            </span>
          )}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className="pagination__button"
          aria-label={`${p}페이지`}
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="pagination__ellipsis" aria-hidden="true">
              ...
            </span>
          )}
          <button
            type="button"
            className="pagination__button"
            aria-label={`${totalPages}페이지`}
            onClick={() => onChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        className="pagination__button"
        aria-label="다음 페이지"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        &gt;
      </button>
    </nav>
  );
}
