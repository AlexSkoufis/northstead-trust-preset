import { useSyncExternalStore } from 'react';

/** Subscribes to a media query. Defaults to `false` before the first read. */
export function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const DESKTOP = '(min-width: 64rem)';
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';
export const REDUCED = '(prefers-reduced-motion: reduce)';
