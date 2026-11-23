import type { ReactNode } from 'react';
import { rich } from '../../i18n';
import { H2, Kicker } from '../../components/ui';

/** emphasis inside the copy (<k>…</k>): the accent */
export const em = (chunk: string) => <span className="text-acc-ink">{chunk}</span>;

/** a headline whose "\n" are hard breaks, each line with its <k> emphasis */
export function RichLines({ src }: { src: string }) {
  return src.split('\n').map((line, i) => <span key={i} className="block">{rich(line, { k: em })}</span>);
}

/** a chapter's kicker ("02 / Why us") and its headline */
export function Head({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-sec-head">
      <Kicker className="rv mb-5.5">{kicker}</Kicker>
      <H2 className="rv">{title}</H2>
      {children}
    </div>
  );
}
