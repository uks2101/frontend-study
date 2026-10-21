import { useEffect, useEffectEvent, useRef } from 'react';

export function useIntersectionObserver(
  onIntersect,
  { enabled = true, rootMargin = '200px' } = {},
) {
  const targetRef = useRef(null);
  const handleIntersect = useEffectEvent(onIntersect);

  useEffect(() => {
    const target = targetRef.current;
    if (!enabled || !target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) handleIntersect();
      },
      { rootMargin },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return targetRef;
}
