import { Link, useParams } from 'react-router';
import { useProduct } from '../hooks/useProducts';
import ProductDetail from '../components/product-detail/ProductDetail';
import ProductDetailSkeleton from '../components/product-detail/ProductDetailSkeleton';
import RelatedProducts from '../components/product-detail/RelatedProducts';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import RecentlyViewed from '../components/product/RecentlyViewed';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { status, data: product, error, refetch } = useProduct(id);

  if (status === 'pending') {
    return <ProductDetailSkeleton />;
  }

  if (status === 'error') {
    if (error.status === 404) {
      return (
        <EmptyState title="상품을 찾을 수 없습니다." description="삭제되었거나 잘못된 주소입니다.">
          <Link to="/" className="btn">
            상품 목록으로
          </Link>
        </EmptyState>
      );
    }
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  return (
    <>
      <ProductDetail key={product.id} product={product} />
      <RelatedProducts productId={id} />
      <RecentlyViewed excludeId={product.id} />
    </>
  );
}
