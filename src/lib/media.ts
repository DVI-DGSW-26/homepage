// The film, the downloads and the zoomed capture: what the CES content spec asks the pages to carry
// beyond stills (the hero's silent loop, the 60–90 s demo, the PDFs), each null or empty until planning
// hands over the file, and the page draws nothing for it until then. Fill these in and the places
// that use them appear.
import type { Lang } from '../i18n/store.ts';
import { createStore, useStore } from './store';

/** The hero's loop, played in the front phone over its still (the `capture` screen, which stays as the
 * poster and the alt text): 8–12 s, silent, 2 MB at most, a portrait screen recording cut to the
 * capture's 865 × 1672 with no status or navigation bar. Under public/assets/video/; WebM first if
 * there is one. Not played for prefers-reduced-motion. */
export const HERO_LOOP: { mp4: string; webm?: string } | null = null;

/** The 60–90 s demo, hosted on YouTube with English subtitles: its video id. It loads only when a
 * visitor asks for it (the video dialog), from youtube-nocookie.com. */
export const DEMO_VIDEO: { youtube: string; seconds: number } | null = null;

/** The files beside the form (Contact.tsx), under public/assets/docs/ (href '/assets/docs/…'): the
 * catalog and the English leaflet made in December. `lang` shows one only to readers of that language. */
export const DOWNLOADS: { href: string; kind: 'catalog' | 'leaflet'; lang?: Lang; mb: number }[] = [];

/** the capture shown full size (Zoom.tsx); null while none is */
export type Zoomed = { src: string; alt: string };
const zoomed = createStore<Zoomed | null>(null);
export const useZoomed = () => useStore(zoomed);
export const zoom = (z: Zoomed | null) => zoomed.set(z);

/** whether the demo video dialog is open */
const video = createStore(false);
export const useVideoOpen = () => useStore(video);
export const openVideo = (open: boolean) => video.set(open);
