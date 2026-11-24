'use client';
// One frame, several screens: the list of what there is to see on the left, the chosen one's sentence
// under its name and the rest dimmed; its screen alone in a large rounded frame on the right, fading out
// at the foot when it runs taller than the frame. A tablist (arrow keys move between the names). On a phone
// the names become a row of chips above the sentence and the frame.
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type ShowcaseItem = { title: string; body: string; tag?: string; view: ReactNode };

export function Showcase({ id, label, items }: { id: string; label: string; items: ShowcaseItem[] }) {
  const [at, setAt] = useState(0);
  const n = items.length;
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = ['ArrowDown', 'ArrowRight'].includes(e.key) ? (at + 1) % n : ['ArrowUp', 'ArrowLeft'].includes(e.key) ? (at + n - 1) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault(); setAt(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };
  const item = items[at];
  return (
    <div className="rv grid gap-8 lg:grid-cols-[minmax(0,.36fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
      <div>
        <div role="tablist" aria-label={label} aria-orientation="vertical"
          className="flex gap-2 overflow-x-auto [scrollbar-width:none] max-lg:-mx-1 max-lg:px-1 lg:grid lg:gap-1">
          {items.map((x, i) => {
            const on = i === at;
            return (
              <button key={x.title} id={`${id}-tab-${i}`} type="button" role="tab" aria-selected={on} aria-controls={`${id}-panel`} tabIndex={on ? 0 : -1}
                onClick={() => setAt(i)} onKeyDown={onKey}
                className={cn('group relative flex-none cursor-pointer text-left transition-colors duration-300',
                  'max-lg:rounded-full max-lg:border max-lg:px-4 max-lg:py-2 max-lg:text-body-sm max-lg:font-semibold',
                  on ? 'max-lg:border-qf max-lg:bg-qf max-lg:text-on-acc' : 'max-lg:border-line max-lg:text-fg-2',
                  // a desktop: the names as a list, the chosen one bright with a bar at its left, its sentence under it
                  'lg:rounded-[12px] lg:py-3.5 lg:pr-4 lg:pl-5 lg:before:absolute lg:before:top-4 lg:before:bottom-4 lg:before:left-0 lg:before:w-0.5 lg:before:rounded-full lg:before:transition-colors lg:before:duration-300',
                  on ? 'lg:bg-card/70 lg:before:bg-qf' : 'lg:before:bg-transparent lg:hover:bg-card/40')}>
                {x.tag && <span className={cn('block text-caption font-semibold transition-colors duration-300 max-lg:hidden', on ? 'text-qf-ink' : 'text-mute')}>{x.tag}</span>}
                <span className={cn('block transition-colors duration-300 lg:text-title-xs lg:font-semibold', on ? 'lg:text-fg' : 'lg:text-mute lg:group-hover:text-fg-2')}>{x.title}</span>
                {/* the sentence, on a desktop under the chosen name only */}
                <span className={cn('grid transition-[grid-template-rows,opacity] duration-400 ease-out max-lg:hidden', on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                  <span className="overflow-hidden">
                    <span className="block pt-2 text-body-sm leading-copy text-fg-2">{x.body}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {/* on a phone the chosen one's sentence goes under the chips */}
        <p className="m-0 mt-4 text-body-sm leading-copy text-fg-2 lg:hidden">{item.body}</p>
      </div>

      {/* the frame: a soft mint light behind, the screen inside, fading out at its foot when taller */}
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-x-[12%] -top-8 -z-1 h-2/3 rounded-full bg-radial/srgb from-acc-glow to-transparent to-70% opacity-60 blur-3xl" />
        <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${at}`}
          className="relative overflow-hidden rounded-[22px] border border-line-2 bg-bg-2 p-3 shadow-device sm:p-4 lg:aspect-[6/5]">
          <div key={at} className="showcase-in flex h-full items-start justify-center">{item.view}</div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-bg-2 to-transparent max-lg:hidden" />
        </div>
      </div>
    </div>
  );
}
