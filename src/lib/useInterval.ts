import { useEffect, useEffectEvent } from 'react';

/** Calls `step` every `ms` while `on`. `step` always sees the latest props and state, and changing it
 * doesn't restart the timer. */
export function useInterval(on: boolean, step: () => void, ms: number) {
  const tick = useEffectEvent(step);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => tick(), ms);
    return () => clearInterval(id);
  }, [on, ms]);
}
