import { useProducts } from '../hooks/useProducts';
import ProductList from '../components/product/ProductList';
import ProductListSkeleton from '../components/product/ProductListSkeleton';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

export default function ProductListPage() {
  const { status, data, error, refetch } = useProducts();

  function renderContent() {
    if (status === 'pending') {
      return <ProductListSkeleton />;
    }

    if (status === 'error') {
      return <ErrorState message={error.message} onRetry={refetch} />;
    }

    if (data.products.length === 0) {
      return <EmptyState title="등록된 상품이 없습니다." description="잠시 후 다시 확인해주세요." />;
    }

    return (
      <>
        <p className="product-page__count">총 {data.total}개</p>
        <ProductList products={data.products} />
      </>
    );
  }

  return (
    <section className="product-page">
      <h1 className="page-title">상품 목록</h1>
      {renderContent()}
    </section>
  )
}