import { fontsReady } from './gsap';

/** The webfonts are in (so headlines measure right), or 1.5 s have passed — whichever comes first. */
export const bootReady: Promise<void> = Promise.race([
  fontsReady.then(() => {}),
  new Promise<void>(r => setTimeout(r, 1500))
]);
