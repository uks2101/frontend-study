import { useParams } from 'react-router';

export default function ProductDetailPage() {
  const { id } = useParams();
  return <h1>상품 상세 #{id}</h1>
}