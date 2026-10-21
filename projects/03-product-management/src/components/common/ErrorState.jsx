export default function ErrorState({ message = '문제가 발생했습니다.', onRetry }) {
  return (
    <div className="state-box" role="alert">
      <p className="state-box__title">{message}</p>
      {onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}
