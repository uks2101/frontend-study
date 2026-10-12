import { formatPrice } from '../../utils/format';

export default function CartSummary({ summary, onOrder }) {
  const { checkedCount, originalPrice, discount, shipping, total, remainingForFreeShipping } = summary;

  return (
    <aside className="cart-summary" aria-labelledby="cart-summary-title">
      <h2 id='cart-summary-title' className="cart-summary__title">결제 예정 금액</h2>

      <dl className="cart-summary__list">
        <div>
          <dt>상품 금액</dt>
          <dd>{formatPrice(originalPrice)}</dd>
        </div>
        <div>
          <dt>할인 금액</dt>
          <dd className="cart-summary__discount">-{formatPrice(discount)}</dd>
        </div>
        <div>
          <dt>배송비</dt>
          <dd>{shipping === 0 ? '무료' : formatPrice(shipping)}</dd>
        </div>
        <div className="cart-summary__total">
          <dt>총 결제 금액</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>

      {checkedCount > 0 && remainingForFreeShipping > 0 && (
        <p className="cart-summary__notice">
          {formatPrice(remainingForFreeShipping)} 더 담으면 <strong>무료 배송</strong>
        </p>
      )}

      <button type='button' className="btn btn--primary btn--block" disabled={checkedCount === 0} onClick={onOrder}>
        {checkedCount}개 상품 주문하기
      </button>
    </aside>
  )
}