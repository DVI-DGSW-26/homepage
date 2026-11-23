// The site's few pieces of global state (the page, the colour mode, the language) live outside
// React; components follow them with useStore(), which re-renders the caller on every change.
import { useSyncExternalStore } from 'react';

export type Store<T> = {
  get: () => T;
  getServer: () => T;
  /** changes the value and tells every follower; setting the same value again is a no-op */
  set: (next: T) => void;
  subscribe: (fn: () => void) => () => void;
};

/** `server`: the value the server renders with, and the client hydrates with before it switches to the
 * real one (the colour mode, read from <html>, is only known in the browser) */
export function createStore<T>(initial: T, server: T = initial): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    getServer: () => server,
    set(next) { if (Object.is(next, value)) return; value = next; listeners.forEach(fn => fn()); },
    subscribe(fn) { listeners.add(fn); return () => { listeners.delete(fn); }; }
  };
}

/** The store's value; re-renders the caller when it changes. */
export const useStore = <T,>(store: Store<T>): T => useSyncExternalStore(store.subscribe, store.get, store.getServer);
