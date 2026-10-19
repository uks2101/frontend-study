export default function SkipLink() {
  function handleClick(e) {
    e.preventDefault();
    document.getElementById('main')?.focus();
  }

  return (
    <a href="#main" className="skip-link" onClick={handleClick}>본문 바로가기</a>
  )
}