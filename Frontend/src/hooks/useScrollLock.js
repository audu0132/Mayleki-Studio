import { useEffect } from 'react';

/**
 * useScrollLock Hook
 * Prevents window scroll when a modal or sidebar drawer is active.
 */
export function useScrollLock(isLocked = false) {
  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLocked]);
}

export default useScrollLock;
