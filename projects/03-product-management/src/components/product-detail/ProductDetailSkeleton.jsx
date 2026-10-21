export default function ProductDetailSkeleton() {
  return (
    <div role="status" aria-label="상품 정보를 불러오는 중">
      <div className="detail__layout" aria-hidden="true">
        <div className="gallery__main skeleton" />
        <div className="detail__info">
          <div className="skeleton skeleton--text" style={{ width: '30%' }} />
          <div className="skeleton skeleton--text" style={{ height: 28 }} />
          <div className="skeleton skeleton--text" style={{ width: '50%' }} />
          <div className="skeleton skeleton--text" style={{ height: 80 }} />
        </div>
      </div>
    </div>
  );
}
