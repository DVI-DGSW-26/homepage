import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/** the floor monitor's own size, in CSS px; the app is laid out at this size */
export const SCREEN_W = 1600, SCREEN_H = 876;

/** The app at the floor monitor's size, scaled to fill the box it is in. With zoom, not a scale
 * transform: zoom lays the text out again at the size it is shown, so it is hinted to the pixel
 * grid and keeps ClearType on Windows; a transform scales a rasterised layer and blurs it. */
export function Fit({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current!;
    setK(el.clientWidth / SCREEN_W);
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / SCREEN_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="absolute inset-0">
      <div style={{ width: SCREEN_W, height: SCREEN_H, zoom: k }}>{children}</div>
    </div>
  );
}
