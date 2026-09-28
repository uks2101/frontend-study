function SearchForm({ keyword, onKeywordChange, onSubmit, showingFavoritesOnly, onToggleFavoritesOnly }) {
  return (
    <section className="search-wrap">
      <div>
        <h1>검색</h1>
        <button type="button" onClick={onToggleFavoritesOnly}>{showingFavoritesOnly ? '전체보기' : '즐겨찾기'}</button>
      </div>
      <form onSubmit={onSubmit}>
        <div className="search-box">
          <img src="image/search.svg" alt="search" />
          <input type="text" placeholder="작품을 검색해보세요." value={keyword} onChange={event => onKeywordChange(event.target.value)} />
        </div>
        <button type="submit">검색</button>
      </form>
    </section>
  )
}

export default SearchForm