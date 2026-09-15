// Smooth scroll modelled on lusion.co's ScrollPane:
//   - every wheel event adds its normalised pixel delta, clamped to ±200 px, to a target
//   - each frame the position moves toward the target by 1 - exp(-12 * dt)  (half-life ≈ 58 ms)
//   - no snapping, no stepping, no walls; keyboard and scrollbar stay native
// Lenis provides the same damping (lerp 0.2 at 60 fps == coefficient 12) on top of native scroll,
// which keeps position: sticky and ScrollTrigger working unchanged.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const easeOut = t => 1 - Math.pow(1 - t, 3);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const WHEEL_CLAMP = 200;      // px per event, as in Lusion's input handler
const EASE_COEFF = 12;        // Lusion's wheelEaseCoeff

export function createScroll({ reduced = false } = {}) {
  const api = { lenis: null, scrollTo: null, refresh() {}, setSnap() {}, getPoints: () => [], getStages: () => [], wheelKind: 'wheel' };

  if (reduced) {
    api.scrollTo = (target) => {
      if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'auto' });
      else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({ behavior: 'auto' });
    };
    return api;
  }

  const lenis = new Lenis({
    lerp: EASE_COEFF / 60,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
    syncTouch: false,
    virtualScroll: (data) => {
      const e = data.event;
      if (e && e.type === 'wheel' && !e.ctrlKey) {
        data.deltaY = clamp(data.deltaY, -WHEEL_CLAMP, WHEEL_CLAMP);
        data.deltaX = clamp(data.deltaX, -WHEEL_CLAMP, WHEEL_CLAMP);
      }
      return true;
    }
  });
  api.lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // hold the page while the preloader curtain is up
  if (document.getElementById('pre')) {
    lenis.stop();
    const release = () => { if (!document.getElementById('pre')) { lenis.start(); mo.disconnect(); } };
    const mo = new MutationObserver(release);
    mo.observe(document.body, { childList: true });
    setTimeout(() => { lenis.start(); mo.disconnect(); }, 8000);
  }

  ScrollTrigger.addEventListener('refresh', () => { if (lenis.isScrolling === false) lenis.resize(); });

  api.scrollTo = (target, opts = {}) => lenis.scrollTo(target, { duration: 1.2, easing: easeOut, lerp: null, ...opts });
  api.debugSnap = () => ({ y: lenis.scroll, target: lenis.targetScroll, velocity: lenis.velocity, isScrolling: lenis.isScrolling, isStopped: lenis.isStopped });
  return api;
}
