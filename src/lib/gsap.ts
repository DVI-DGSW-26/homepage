import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export const fontsReady: Promise<unknown> = document.fonts ? document.fonts.ready : Promise.resolve();

export { gsap, ScrollTrigger, SplitText, useGSAP };
