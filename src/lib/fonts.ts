// Plex Sans KR in full, for characters outside the cut the site ships (scripts/fonts.mjs). Everything the
// site prints is in the cut, so only what a visitor types can need it: its declarations (src/styles/
// fonts.css, unicode-range slices, so just the slices a character falls in download) load the first time
// a text field gets focus. The single-file build declares its fonts through Google Fonts instead
// (scripts/single.mjs).
const INLINE = '__ASSETS__' in window;

export function fullFaceOnInput() {
  if (INLINE) return;
  const onFocus = (e: FocusEvent) => {
    if (!(e.target as Element).matches?.('input, textarea')) return;
    document.removeEventListener('focusin', onFocus);
    import('../styles/fonts.css').catch(() => {});
  };
  document.addEventListener('focusin', onFocus);
}
