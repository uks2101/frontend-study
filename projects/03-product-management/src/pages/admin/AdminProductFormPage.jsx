import { useParams } from 'react-router';

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  return <h1>{isEdit ? `상품 수정 #${id}` : '상품 등록'}</h1>
}