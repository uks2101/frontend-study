function ProductCardSkeleton() {
  return (
    <li className="product-card">
      <div className="product-card__thumb skeleton" />
      <div className="product-card__body">
        <div className="skeleton skeleton--text" style={{ width: '40%' }} />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text" style={{ width: '60%' }} />
      </div>
    </li>
  );
}

export default function ProductListSkeleton({ count = 8, view = 'grid' }) {
  return (
    <div role="status" aria-label="상품을 불러오는 중">
      <ul className={`product-list product-list--${view}`} aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </ul>
    </div>
  );
}
