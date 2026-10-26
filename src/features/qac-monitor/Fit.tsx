import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/** the screens the app is drawn for, in CSS px: the floor's Studio Display, an iPad Pro 13" on its
 * side (1376 × 1032 pt), and an iPhone 16 Pro Max's display below its status bar (440 × 956 pt, less 62) */
export const SCREENS_PX = { monitor: [1600, 876], tablet: [1376, 1032], phone: [440, 894] } as const;
export type Form = keyof typeof SCREENS_PX;

/** The app at a screen's own size, scaled to fill the box it is in. With zoom, not a scale
 * transform: zoom lays the text out again at the size it is shown, so it is hinted to the pixel
 * grid and keeps ClearType on Windows; a transform scales a rasterised layer and blurs it. */
export function Fit({ form, children }: { form: Form; children: ReactNode }) {
  const [w, h] = SCREENS_PX[form];
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current!;
    setK(el.clientWidth / w);
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / w));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={ref} className="absolute inset-0">
      <div style={{ width: w, height: h, zoom: k }}>{children}</div>
    </div>
  );
}
