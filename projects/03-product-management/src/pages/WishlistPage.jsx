import { Link } from 'react-router';
import { useWishlistItems } from '../store/wishlist/wishlistStore';
import ProductList from '../components/product/ProductList';
import EmptyState from '../components/common/EmptyState';

export default function WishlistPage() {
  const items = useWishlistItems();

  return (
    <section>
      <title>찜한 상품 | SHOP</title>
      <h1 className="page-title">
        찜한 상품 {items.length > 0 && <span className="page-title__count">{items.length}</span>}
      </h1>

      {items.length === 0 ? (
        <EmptyState
          title="찜한 상품이 없습니다."
          description="마음에 드는 상품의 ♡ 버튼을 눌러보세요."
        >
          <Link to="/" className="btn">
            상품 보러 가기
          </Link>
        </EmptyState>
      ) : (
        <ProductList products={items} />
      )}
    </section>
  );
}
