import { toggleWishlist, useIsWishlisted } from '../../store/wishlist/wishlistStore';

export default function WishlistButton({ product, className = '' }) {
  const isWishlisted = useIsWishlisted(product.id);

  return (
    <button
      type="button"
      className={`wishlist-button ${className}`}
      aria-pressed={isWishlisted}
      aria-label={`${product.title} 찜하기`}
      onClick={() => toggleWishlist(product)}
    >
      <span aria-hidden="true">{isWishlisted ? '♥' : '♡'}</span>
    </button>
  );
}
