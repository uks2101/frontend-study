import { useRelatedProducts } from '../../hooks/useProducts';
import ProductList from '../product/ProductList';
import ProductListSkeleton from '../product/ProductListSkeleton';

export default function RelatedProducts({ productId }) {
  const { status, data } = useRelatedProducts(productId);

  if (status === 'error' || data?.length === 0) return null;

  return (
    <section className="related" aria-labelledby="related-title">
      <h2 id='related-title' className="related__title">이런 상품은 어떠세요?</h2>
      {status === 'pending' ? <ProductListSkeleton count={4} /> : <ProductList products={data} />}
    </section>
  )
}