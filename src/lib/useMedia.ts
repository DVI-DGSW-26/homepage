import { useCallback, useSyncExternalStore } from 'react';

/** Whether a media query matches now; re-renders the caller when that changes. */
export function useMedia(query: string) {
  const subscribe = useCallback((fn: () => void) => {
    const mq = matchMedia(query);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [query]);
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches);
}
