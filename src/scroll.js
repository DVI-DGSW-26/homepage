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

  let gates = [], prevY = 0, locked = false, unlockCall = null, lockedAt = 0, lockMs = 0, restGate = null, restDir = 0;
  let lastWheelAt = -1e9, needFresh = false, lastY = 0;
  const GESTURE_GAP = 150;   // ms of wheel silence that separates one gesture from the next
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
        // gaps are measured on the events' own timestamps, so a janky frame that delivers queued events late is not mistaken for a new gesture
        const now = performance.now(), stamp = e.timeStamp || now, gap = stamp - lastWheelAt; lastWheelAt = stamp;
        if (locked) { if (now - lockedAt > lockMs + 1500) release(); }   // Lenis drops the event itself while stopped; this is only the watchdog
        else if (needFresh) {
          // the gesture that hit the gate (and its inertia) must end before scrolling resumes, so one flick never plays two gates
          if (gap > GESTURE_GAP) needFresh = false;
          else { e.preventDefault(); data.deltaX = 0; data.deltaY = 0; }
        }
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
    const fallback = setTimeout(() => { mo.disconnect(); if (!locked) lenis.start(); }, 8000);
    const release = () => { if (!document.getElementById('pre')) { clearTimeout(fallback); mo.disconnect(); if (!locked) lenis.start(); } };
    const mo = new MutationObserver(release);
    mo.observe(document.body, { childList: true });
  }

  ScrollTrigger.addEventListener('refresh', () => { if (lenis.isScrolling === false) lenis.resize(); });

  // ---- gates: crossing a boundary pins the page there, plays a timed animation, then releases ----
  // A gate is { y, dir (1 = downward only, -1 = upward only, 0 = both), run(dir) -> lock duration in ms }.
  prevY = lastY = lenis.scroll;
  api.setGates = (list) => { gates = list.slice().sort((a, b) => a.y - b.y); prevY = lastY = lenis.scroll; };
  api.isLocked = () => locked;
  const release = () => {
    if (!locked) return;
    if (unlockCall) { unlockCall.kill(); unlockCall = null; }
    try { lenis.start(); } catch (e) { console.error(e); }
    // resting exactly on the gate: leaving it the way we came re-runs it (beat i-1 / i), leaving onward does not.
    // a keyboard jump during the lock leaves us elsewhere, so prevY follows the real position then.
    const y = lenis.scroll, atRest = !!restGate && Math.abs(y - restGate.y) < 1;
    lastY = y; prevY = atRest ? restGate.y + (restDir > 0 ? 0.25 : -0.25) : y;
    locked = false; needFresh = true;
    // the page was moved natively (keyboard, scrollbar) during the lock: let the section match where it really is
    if (!atRest && restGate && restGate.settle) { try { restGate.settle(y); } catch (e) { console.error(e); } }
  };
  const engage = (g, dir) => {
    locked = true; lockedAt = performance.now(); restGate = g; restDir = dir; if (unlockCall) unlockCall.kill();
    let ms = 800; try { ms = g.run(dir) || ms; } catch (e) { console.error(e); }
    lockMs = ms;
    // the release is armed first and rides the same ticker as the animation, so it fires exactly when the animation ends
    unlockCall = gsap.delayedCall(ms / 1000, release);
    try { lenis.scrollTo(g.y, { immediate: true, force: true }); lenis.stop(); } catch (e) { console.error(e); }
  };
  lenis.on('scroll', (l) => {
    const flying = !!(l.userData && l.userData.flight);   // a programmatic flight (nav link) passes over the gates
    if (locked || flying || !gates.length || l.isStopped) { lastY = l.scroll; if (!locked) prevY = l.scroll; return; }
    // The branch follows the real motion and prevY only advances once the page is past it. A rest position can read back a
    // fraction off the gate (fractional device pixel ratios), and onward motion must never be taken for a reverse crossing.
    const y = l.scroll, dy = y - lastY; lastY = y;
    if (dy > 0 && y > prevY) { for (const g of gates) if (g.dir >= 0 && prevY < g.y && y >= g.y && (!g.when || g.when(1))) return engage(g, 1); prevY = y; }
    else if (dy < 0 && y < prevY) { for (let i = gates.length - 1; i >= 0; i--) { const g = gates[i]; if (g.dir <= 0 && prevY > g.y && y <= g.y && (!g.when || g.when(-1))) return engage(g, -1); } prevY = y; }
  });

  api.scrollTo = (target, opts = {}) => {
    // a nav click during a lock wins; the gate's animation just keeps playing. prevY first: start() emits, and a stale prevY would re-engage the same gate
    if (locked) release();
    needFresh = false;
    const done = opts.onComplete;
    return lenis.scrollTo(target, {
      duration: 1.2, easing: easeOut, lerp: null, ...opts, userData: { flight: true },
      onComplete: (...a) => {
        // a flight that lands a hair above a section gate steps onto it, so the section's own trigger plays it (no lock)
        const y = lenis.scroll, g = gates.find(g => g.dir === 1 && y < g.y && g.y - y <= 2);
        prevY = g ? g.y : y; lastY = y;
        if (g) lenis.scrollTo(g.y, { immediate: true, force: true });
        done && done(...a);
      }
    });
  };
  api.debugSnap = () => ({ y: lenis.scroll, target: lenis.targetScroll, velocity: lenis.velocity, isScrolling: lenis.isScrolling, isStopped: lenis.isStopped, locked, lockMs, lockedFor: locked ? Math.round(performance.now() - lockedAt) : 0, gates: gates.map(g => g.y) });
  return api;
}
