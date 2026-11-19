// Page-wide scroll reveals, driven by the marker classes documented in src/components/ui.tsx.
// Runs from <App> once every section of the page has mounted; returns the teardown.
//
// No animation library: an IntersectionObserver notices a block crossing the reveal line (90% down the
// screen) and the Web Animations API plays its fade-up. Every reveal plays once and is then unobserved,
// so nothing replays on the way back and the observer has less to watch the further the visitor reads.
import { REDUCED } from './env';

const $$ = (s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<HTMLElement>(s));
/** GSAP's power3.out, which these reveals used before */
const EASE = 'cubic-bezier(.215, .61, .355, 1)';

export function setupReveals() {
  if (REDUCED) return () => {};
  const items = $$('.rv');
  const batchOf = new Map(items.map(el => [el, el.closest<HTMLElement>('[data-batch]')]));

  // Hide every block first, observe after: one style write for the page, then one layout for the observer.
  // The hidden state is inline and the animation leaves nothing behind (no fill), so a revealed block
  // carries no transform: a leftover one keeps it on its own layer, where Windows draws the text greyscale.
  for (const el of items) { el.style.opacity = '0'; el.style.transform = `translateY(${batchOf.get(el) ? 40 : 36}px)`; }

  const reveal = (el: HTMLElement, delay: number) => {
    const y = el.style.transform;
    el.style.opacity = ''; el.style.transform = '';
    el.animate([{ opacity: 0, transform: y }, { opacity: 1, transform: 'none' }],
      { duration: batchOf.get(el) ? 700 : 750, delay, easing: EASE, fill: 'backwards' });
  };

  // The root reaches far above the screen, so a block counts as in from the moment its top passes the
  // line until long after: a jump past it (an anchor link, a reload halfway down) still reveals it.
  const io = new IntersectionObserver(entries => {
    // the blocks of one [data-batch] group arriving together come in one after another, in page order
    const waves = new Map<HTMLElement | null, number>();
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement, group = batchOf.get(el) ?? null;
      io.unobserve(el);
      const n = group ? waves.get(group) ?? 0 : 0;
      if (group) waves.set(group, n + 1);
      reveal(el, n * 60);
    }
  }, { rootMargin: '100000px 0px -10% 0px' });
  items.forEach(el => io.observe(el));

  return () => {
    io.disconnect();
    for (const el of items) { el.style.opacity = ''; el.style.transform = ''; el.getAnimations().forEach(a => a.cancel()); }
  };
}
