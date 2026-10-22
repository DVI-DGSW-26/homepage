// <Img>: the site's <img>, doing what next/image does but with the work done at build time.
//
// scripts/images.mjs writes AVIF / WebP copies of every picture at several widths plus a manifest;
// this component reads it and renders
//   <picture> <source avif srcset> <source webp srcset> <img original> </picture>
// so the browser picks the smallest file that fills the box (`sizes` says how wide the box is),
// with intrinsic width/height (no layout shift), lazy loading, and the picture's average colour or
// a 16px blurred preview showing until it arrives. `priority` is for the first screen: eager, high
// fetch priority, no placeholder.
//
// <picture> is display: contents, so the <img> stays the box that classes, refs and grid/flex
// placement apply to. A path with no manifest entry, and the single-file build (whose images are
// inlined as data URIs, see scripts/single.mjs), get a plain <img>.
import type { ComponentProps, CSSProperties } from 'react';
import data from '../generated/images.json';

type Meta = { w: number; h: number; v: string; ws: number[]; c?: string; b?: string };
const IMAGES = data as Record<string, Meta>;
const INLINE = typeof window !== 'undefined' && '__ASSETS__' in window;

const variant = (src: string, m: Meta, w: number, fmt: string) =>
  `${src.replace(/^assets\/img\//, 'assets/opt/').replace(/\.[^.]+$/, '')}.${m.v}-${w}.${fmt}`;
const srcSet = (src: string, m: Meta, fmt: string) => m.ws.map(w => `${variant(src, m, w, fmt)} ${w}w`).join(', ');

export type ImgProps = Omit<ComponentProps<'img'>, 'src' | 'srcSet' | 'width' | 'height'> & {
  src: string;
  /** how wide the image is drawn, as for <img sizes>: '100vw' (the default), '(max-width: 859px) 50vw, 25vw', '170px' */
  sizes?: string;
  /** above the fold: load now, at high priority */
  priority?: boolean;
};

export function Img({ src, sizes = '100vw', priority = false, alt = '', loading, decoding = 'async', style, ...rest }: ImgProps) {
  const m = IMAGES[src];
  const base = {
    src, alt, decoding,
    width: m?.w, height: m?.h,
    loading: loading ?? (priority ? 'eager' : 'lazy'),
    fetchPriority: priority ? 'high' as const : undefined,
    ...rest
  };
  if (!m || INLINE || !m.ws.length) return <img {...base} style={style} />;
  // an opaque image covers its own background once it has loaded
  const placeholder: CSSProperties | undefined = priority || !m.c ? undefined
    : m.b ? { backgroundColor: m.c, backgroundImage: `url("${m.b}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: m.c };
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={srcSet(src, m, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(src, m, 'webp')} sizes={sizes} />
      <img {...base} sizes={sizes} style={placeholder ? { ...placeholder, ...style } : style} />
    </picture>
  );
}
