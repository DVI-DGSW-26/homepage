import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const fontsReady: Promise<unknown> = document.fonts ? document.fonts.ready : Promise.resolve();

export { gsap, ScrollTrigger, useGSAP };
