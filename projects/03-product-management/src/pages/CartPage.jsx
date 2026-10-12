import { Link } from 'react-router';
import { useCart, useCartActions } from '../store/cart/cartContext';
import { getCartSummary } from '../store/cart/cartSelectors';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../store/toast/toastContext';

export default function CartPage() {
  const { items } = useCart();
  const { toggleAll, removeChecked } = useCartActions();
  const toast = useToast();

  if (items.length === 0) {
    return (
      <EmptyState title="장바구니가 비어 있습니다." description="마음에 드는 상품을 담아보세요.">
        <title>장바구니 | SHOP</title>
        <Link to="/" className="btn">쇼핑하러 가기</Link>
      </EmptyState>
    );
  }

  const summary = getCartSummary(items);
  const allChecked = summary.checkedCount === items.length;
  const someChecked = summary.checkedCount > 0 && !allChecked;

  function handleOrder() {
    toast.info('데모 프로젝트라 주문 기능은 제공하지 않습니다.');
  }

  function handleRemoveChecked() {
    removeChecked();
    toast.info(`${summary.checkedCount}개 상품을 삭제했습니다.`);
  }

  return (
    <section className="cart">
      <title>장바구니 | SHOP</title>
      <h1 className="page-title">장바구니</h1>

      <div className="cart__layout">
        <div className="cart__main">
          <div className="cart__toolbar">
            <label className="cart__check-all">
              <input
                type='checkbox'
                checked={allChecked}
                ref={(el) => {
                  if (el) el.indeterminate = someChecked;
                }}
                onChange={(e) => toggleAll(e.target.checked)}
              />
              전체 선택 ({summary.checkedCount}/{items.length})
            </label>
            <button
              type='button'
              className="btn btn--sm"
              disabled={summary.checkedCount === 0}
              onClick={handleRemoveChecked}
            >
              선택 삭제
            </button>
          </div>

          <ul className="cart-list">
            {items.map((item, index) => (
              <CartItem key={item.id} item={item} index={index} />
            ))}
          </ul>
        </div>

        <CartSummary summary={summary} onOrder={handleOrder} />
      </div>
    </section>
  )
}