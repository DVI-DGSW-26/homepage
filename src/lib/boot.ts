/** The webfonts are in (so headlines measure right), or 1.5 s have passed — whichever comes first. Browser only. */
export const bootReady = (): Promise<void> => Promise.race([
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {}),
  new Promise<void>(r => setTimeout(r, 1500))
]);
