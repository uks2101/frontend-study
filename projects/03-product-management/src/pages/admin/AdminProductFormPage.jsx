import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { useProduct } from '../../hooks/useProducts';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useAdminProducts';
import { useToast } from '../../store/toast/toastContext';
import { EMPTY_PRODUCT_FORM, toFormValues, toProductPayload } from '../../utils/productForm';
import ProductForm from '../../components/admin/ProductForm';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

function useReturnTo() {
  const location = useLocation();
  return location.state?.returnTo ?? '/admin';
}

function CreateProduct() {
  const createMutation = useCreateProduct();
  const toast = useToast();
  const navigate = useNavigate();
  const returnTo = useReturnTo();

  function handleSubmit(values) {
    createMutation.mutate(toProductPayload(values), {
      onSuccess: (product) => {
        toast.success(`'${product.title}' 상품을 등록했습니다.`);
        navigate('/admin', { state: { saved: true } });
      },
      onError: (err) => toast.error(err.message),
    });
  }

  return (
    <ProductForm
      initialValues={EMPTY_PRODUCT_FORM}
      submitLabel="등록하기"
      isSubmitting={createMutation.isPending}
      onSubmit={handleSubmit}
      onCancel={() => navigate(returnTo)}
    />
  )
}

function EditProduct({ id }) {
  const { status, data: product, error, refetch } = useProduct(id);
  const updateMutation = useUpdateProduct();
  const toast = useToast();
  const navigate = useNavigate();
  const returnTo = useReturnTo();

  if (status === 'pending') {
    return <p className="admin-loading" role="status">상품 정보를 불러오는 중...</p>;
  }

  if (status === 'error') {
    if (error.status === 404) {
      return (
        <EmptyState title="상품을 찾을 수 없습니다.">
          <Link to="/admin" className="btn">목록으로</Link>
        </EmptyState>
      );
    }
    return <ErrorState message={error.message} onRetry={refetch} />;
  }

  function handleSubmit(values) {
    updateMutation.mutate(
      { id: product.id, data: toProductPayload(values, product) },
      {
        onSuccess: (updated) => {
          toast.success(`'${updated.title}' 상품을 수정했습니다.`);
          navigate(returnTo, { state: { saved: true } });
        },
        onError: (err) => toast.error(err.message)
      }
    );
  }

  return (
    <ProductForm
      key={product.id}
      initialValues={toFormValues(product)}
      submitLabel="수정하기"
      isSubmitting={updateMutation.isPending}
      onSubmit={handleSubmit}
      onCancel={() => navigate(returnTo)}
    />
  )
}

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const title = isEdit ? '상품 수정' : '상품 등록';

  return (
    <section className="admin-page">
      <title>{`${title} | SHOP ADMIN`}</title>
      <h1 className="page-title">{title}</h1>
      {isEdit ? <EditProduct id={id} /> : <CreateProduct /> }
    </section>
  )
}