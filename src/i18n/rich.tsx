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
