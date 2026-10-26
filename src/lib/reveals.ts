// Page-wide scroll reveals, driven by the marker classes documented in src/components/ui.tsx.
// Runs once from <App>, after every section has mounted.
//
// Every reveal plays once: `once: true` kills its trigger after it fires, so the further the
// visitor scrolls, the fewer triggers are left to check each frame. Nothing replays on the way back.
import { gsap, ScrollTrigger } from './gsap';
import { REDUCED } from './env';

const $$ = (s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<HTMLElement>(s));

export function setupReveals() {
  const counts = $$('[data-count]');
  if (REDUCED) { counts.forEach(el => { el.textContent = (+el.dataset.count!).toLocaleString('en-US'); }); return; }

  const solo = $$('.rv').filter(el => !el.closest('[data-batch]'));
  const groups = $$('[data-batch]').map(g => $$('.rv', g)).filter(items => items.length);
  const wipes = $$('[data-wipe]');

  // Once in, a reveal clears its inline transform and opacity (clearProps): a leftover transform
  // keeps the element on its own layer, where Windows draws the text greyscale instead of ClearType.
  //
  // Write every hidden state first, create the triggers after. A trigger measures the page the
  // moment it is created, so a style write between two creations (what one gsap.from() per element
  // did) forces a fresh layout for each of them — that alone was most of the start-up stall.
  gsap.set(solo, { y: 36, opacity: 0 });
  groups.forEach(items => gsap.set(items, { y: 40, opacity: 0 }));
  gsap.set(wipes, { clipPath: 'inset(100% 0 0 0)' });

  solo.forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: .75, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform,opacity' }) }));
  // the .rv children of a [data-batch] group arrive together, staggered.
  // `overwrite: 'auto'`, never `true`: `true` kills every other tween on the same target and would
  // cut the clip-path wipe below off mid-animation, leaving the photo sliced
  groups.forEach(items => ScrollTrigger.batch(items, { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: .7, ease: 'power3.out', stagger: .06, overwrite: 'auto', clearProps: 'transform,opacity' }) }));
  // photos wipe open from the bottom as they arrive
  const delayOf = (el: HTMLElement) => Math.min(wipes.filter(w => w.parentElement === el.parentElement).indexOf(el), 7) * .04;
  if (wipes.length) ScrollTrigger.batch(wipes, { start: 'top 94%', once: true, onEnter: b => b.forEach(el => gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: .8, ease: 'power4.out', delay: delayOf(el as HTMLElement) })) });
  counts.forEach(el => {
    const target = +el.dataset.count!, o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: target, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-US'); } }) });
  });
}
