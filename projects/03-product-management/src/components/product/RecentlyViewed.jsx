import { clearRecentlyViewed, useRecentlyViewed } from '../../store/recent/recentStore';
import ProductList from './ProductList';

export default function RecentlyViewed({ excludeId }) {
  const items = useRecentlyViewed();
  const visibleItems = items.filter((item) => item.id !== excludeId).slice(0, 4);

  if (visibleItems.length === 0) return null;

  return (
    <section className="related" aria-labelledby="recent-title">
      <div className="related__header">
        <h2 id="recent-title" className="related__title">
          최근 본 상품
        </h2>
        <button type="button" className="related__clear" onClick={clearRecentlyViewed}>
          전체 삭제
        </button>
      </div>
      <ProductList products={visibleItems} />
    </section>
  );
}
