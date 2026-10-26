import { useT } from '../../../i18n';
import { ICON } from '../../../components/icons';
import { Band, Kicker, Lead, LineIcon, cn } from '../../../components/ui';
import { RichLines } from '../parts';

/** data in, verified data, data out */
const STORY = [ICON.camera, ICON.verified, ICON.chart];

/** 01 the vision, and the story in three cards joined by arrows */
export function Vision() {
  const m = useT().future;
  return (
    <Band id="future-hero" cover>
      <div className="mb-sec-head">
        <Kicker className="rv mb-5.5">01 / {m.eyebrow}</Kicker>
        <h1 className="rv m-0 font-display text-h2-lg leading-h2 font-extrabold tracking-tight text-balance"><RichLines src={m.title} /></h1>
        <Lead className="rv mt-6">{m.lead}</Lead>
      </div>
      <ol data-batch aria-label={m.storyLabel} className="m-0 grid list-none grid-cols-3 gap-4.5 p-0 max-md:grid-cols-1 spanned:gap-x-hinge">
        {m.story.map((s, i) => {
          const out = i === m.story.length - 1;
          return (
            <li key={s.tag} className={cn('rv relative grid content-start gap-3 rounded-card border p-panel-pad',
              out ? 'border-qf bg-qf text-on-acc' : i === 0 ? 'border-qf-line bg-qf-soft' : 'border-line bg-card')}>
              <div className="flex items-center justify-between">
                <span className={cn('mono text-tag', out ? 'text-on-acc/70' : 'text-mute')}>{s.tag}</span>
                <LineIcon d={STORY[i]} className={cn('size-6', out ? 'text-on-acc' : 'text-qf-ink')} />
              </div>
              <h2 className="m-0 text-title leading-tight font-semibold">{s.title}</h2>
              <p className={cn('m-0 text-body-sm leading-copy', out ? 'text-on-acc/80' : 'text-fg-2')}>{s.body}</p>
              {/* the arrow to the next card, in the gap (below each other on a phone, it points down) */}
              {!out && (
                <span aria-hidden="true" className="absolute top-1/2 -right-3.75 z-1 grid size-6 -translate-y-1/2 place-items-center rounded-full border border-line-2 bg-bg text-mute max-md:top-auto max-md:right-auto max-md:-bottom-3.75 max-md:left-1/2 max-md:translate-y-0 max-md:-translate-x-1/2 max-md:rotate-90">
                  <LineIcon d={ICON.arrow} className="size-3.5" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </Band>
  );
}
