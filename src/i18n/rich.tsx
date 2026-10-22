import { Fragment, type ReactNode } from 'react';

/**
 * Renders dictionary copy that carries markup as <tag>…</tag>, mapping each tag to a component:
 *   rich(m.about.manifesto, { k: chunk => <K>{chunk}</K> })
 * Tags don't nest; text outside them is passed through as is.
 */
export function rich(src: string, tags: Record<string, (chunk: string) => ReactNode>): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /<(\w+)>(.*?)<\/\1>/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const render = tags[m[1]];
    out.push(<Fragment key={m.index}>{render ? render(m[2]) : m[2]}</Fragment>);
    last = re.lastIndex;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

/**
 * Renders dictionary copy whose "\n" marks where a line had better break: lines(m.product.lead).
 * Each piece stays whole on a line while it fits, so a wrapping paragraph breaks between sentences
 * or phrases first ("…소재입니다. / 지속 가능한…", not "…소재입니다. 지속 / 가능한…"); pieces that fit
 * together share a line, and a piece longer than the line still wraps inside itself.
 * Copy shown without lines() reads the "\n" as a plain space.
 */
export function lines(src: string): ReactNode {
  if (!src.includes('\n')) return src;
  return src.split('\n').map((piece, i) => (
    <Fragment key={i}>{i > 0 && ' '}<span className="inline-block">{piece}</span></Fragment>
  ));
}
