import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  ADMIN_PAGE_SIZE,
  useAdminProductParams,
  useAdminProducts,
  useDeleteProducts,
  useUpdateStock,
} from '../../hooks/useAdminProducts';
import { toast } from '../../store/toast/toastStore';
import SearchBar from '../../components/filter/SearchBar';
import ProductTable from '../../components/admin/ProductTable';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function AdminProductsPage() {
  const { params, setPage, setSearch, setSort } = useAdminProductParams();
  const { status, data, error, isPlaceholderData, refetch } = useAdminProducts(params);
  const deleteMutation = useDeleteProducts();
  const stockMutation = useUpdateStock();
  const location = useLocation();
  const returnTo = location.pathname + location.search;

  const listKey = JSON.stringify(params);
  const [selection, setSelection] = useState({ key: listKey, ids: [] });
  const selectedIds = selection.key === listKey ? selection.ids : [];
  const [deleteTarget, setDeleteTarget] = useState(null);

  function toggleOne(id) {
    const ids = selectedIds.includes(id)
      ? selectedIds.filter((v) => v !== id)
      : [...selectedIds, id];
    setSelection({ key: listKey, ids });
  }

  function toggleAll(checked) {
    setSelection({ key: listKey, ids: checked ? data.products.map((p) => p.id) : [] });
  }

  function handleConfirmDelete() {
    const ids = deleteTarget;
    const nextTotalPages = Math.ceil((data.total - ids.length) / ADMIN_PAGE_SIZE);

    setDeleteTarget(null);
    setSelection({ key: listKey, ids: [] });
    if (params.page > nextTotalPages && nextTotalPages > 0) {
      setPage(nextTotalPages);
    }

    deleteMutation.mutate(ids, {
      onSuccess: () => {
        toast.success(`${ids.length}개 상품을 삭제했습니다.`);
      },
      onError: (err) => {
        toast.error(`삭제하지 못했습니다. ${err.message}`);
      },
    });
  }

  function handleStockSave(product, stock) {
    stockMutation.mutate(
      { id: product.id, stock, previousStock: product.stock },
      {
        onError: (err) =>
          toast.error(`'${product.title}' 재고를 저장하지 못했습니다. ${err.message}`),
      },
    );
  }

  function renderContent() {
    if (status === 'pending') {
      return (
        <p className="admin-loading" role="status">
          상품 목록을 불러오는 중...
        </p>
      );
    }

    if (status === 'error') {
      return <ErrorState message={error.message} onRetry={refetch} />;
    }

    if (data.products.length === 0) {
      return params.q ? (
        <EmptyState title={`'${params.q}' 검색 결과가 없습니다.`} />
      ) : (
        <EmptyState title="상품이 없습니다.">
          {params.page > 1 && (
            <button type="button" className="btn" onClick={() => setPage(1)}>
              첫 페이지로
            </button>
          )}
        </EmptyState>
      );
    }

    return (
      <div className={isPlaceholderData ? 'is-stale' : undefined} aria-busy={isPlaceholderData}>
        <ProductTable
          products={data.products}
          sort={params.sort}
          onSort={setSort}
          selectedIds={selectedIds}
          onToggle={toggleOne}
          onToggleAll={toggleAll}
          onDelete={setDeleteTarget}
          onStockSave={handleStockSave}
          onStockInvalid={(message) => toast.error(message)}
          returnTo={returnTo}
        />
        <Pagination page={params.page} totalPages={data.totalPages} onChange={setPage} />
      </div>
    );
  }

  return (
    <section className="admin-page">
      <title>상품 관리 | SHOP ADMIN</title>

      <div className="admin-page__header">
        <h1 className="page-title">상품 관리</h1>
        <Link to="/admin/products/new" state={{ returnTo }} className="btn btn--primary">
          + 상품 등록
        </Link>
      </div>

      <div className="admin-toolbar">
        <SearchBar value={params.q} onSearch={setSearch} />
        <p className="admin-toolbar__count">{status === 'success' && `총 ${data.total}개`}</p>
        <button
          type="button"
          className="btn btn--danger-outline"
          disabled={selectedIds.length === 0}
          onClick={() => setDeleteTarget(selectedIds)}
        >
          선택 삭제 ({selectedIds.length})
        </button>
      </div>

      {renderContent()}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="상품을 삭제할까요?"
        description={`선택한 ${deleteTarget?.length ?? 0}개 상품이 삭제됩니다. 삭제한 상품은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
