// Profile lab: a multi-hollow profile pushed out of a die by a press.
// Scene units are mm / 25. The canvas spans the whole section; the die sits left of centre and the
// profile runs out to the right, toward the camera, while the camera dollies back so it always fits.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { token, withAlpha } from '../lib/tokens';
import { MAX_LEN, REST_LEN, type ProfileParams } from './meta';
import { NARROW } from '../lib/env';

const S = 1 / 25;
const rr = (p: THREE.Path, x: number, y: number, w: number, h: number, r: number) => {
  r = Math.min(r, w / 2, h / 2);
  p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r);
  p.lineTo(x + w, y + h - r); p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  p.lineTo(x + r, y + h); p.quadraticCurveTo(x, y + h, x, y + h - r);
  p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y);
};

export interface ExtrusionApi { setParams(p: Partial<ProfileParams>): void; setProgress(p: number): void; setActive(v: boolean): void; setLight(v: boolean): void; readonly length: number; destroy(): void }

export function createExtrusion(canvas: HTMLCanvasElement, { reduced = false, fine = true, light = false }: { reduced?: boolean; fine?: boolean; light?: boolean } = {}): ExtrusionApi {
  let len = REST_LEN;
  const api: ExtrusionApi = { setParams() {}, setProgress() {}, setActive() {}, setLight() {}, get length() { return len; }, destroy() {} };
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
  catch { canvas.style.display = 'none'; return api; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, (navigator.hardwareConcurrency || 8) <= 4 ? 1.25 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 600);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  pmrem.dispose();

  // brushed die-line texture; repeat along the length is tied to the length so the pattern
  // travels WITH the metal instead of stretching (reads as "pushed out", not "pulled")
  // Grey-scale streaks centred near mid, so the same texture drives both the bump and the
  // roughness: the die lines catch and break the reflection the way drawn aluminium does.
  const brush = (() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 64; const g = c.getContext('2d')!;
    // a height / roughness map, not a colour: mid grey with black and white streaks
    g.fillStyle = '#8c8c8c'; g.fillRect(0, 0, 512, 64);
    for (let i = 0; i < 3200; i++) {
      const v = Math.random() < .5 ? 0 : 255;
      g.fillStyle = `rgba(${v},${v},${v},${Math.random() * .3})`;
      g.fillRect(Math.random() * 512, 0, Math.random() < .8 ? 1 : 2, 64);
    }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 1); t.anisotropy = renderer.capabilities.getMaxAnisotropy(); return t;
  })();
  // Mill-finish aluminium: on a metal the base colour IS the specular reflectance, so a neutral
  // mid grey (rather than the near-white it used to be) is what stops it reading as white plastic.
  // Satin, not mirror — roughness is the base multiplied by the streak map, landing near 0.45.
  const alu = new THREE.MeshStandardMaterial({
    color: token('--scene-mill'), metalness: 1,
    roughness: 0.9, roughnessMap: brush,
    bumpMap: brush, bumpScale: 0.012,
    envMapIntensity: 0.45
  });
  const steel = new THREE.MeshStandardMaterial({ color: token('--scene-steel'), metalness: 0.92, roughness: 0.6, envMapIntensity: 0.55 });
  const steelLight = new THREE.MeshStandardMaterial({ color: token('--scene-container'), metalness: 0.9, roughness: 0.5, envMapIntensity: 0.6 });

  const group = new THREE.Group(); scene.add(group);
  let profile: THREE.Mesh | null = null, die: THREE.Mesh | null = null, container: THREE.Group | null = null;
  const hot = new THREE.PointLight(token('--scene-die-hot'), 0, 6.5, 2); hot.position.set(0, 0, 0.35); group.add(hot);
  const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')!; const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); const glowC = token('--scene-die-glow'); gr.addColorStop(0, withAlpha(glowC, .9)); gr.addColorStop(.35, withAlpha(glowC, .35)); gr.addColorStop(1, withAlpha(glowC, 0)); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
  const glowMat = new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 });
  const glow = new THREE.Sprite(glowMat); glow.position.z = 0.05; group.add(glow);
  const boltGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.06, 12);
  const boltMat = new THREE.MeshStandardMaterial({ color: token('--scene-bolt'), metalness: 1, roughness: 0.35 });

  const key = new THREE.DirectionalLight(token('--scene-key'), 0.9); key.position.set(-4, 6, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(token('--scene-rim-cool'), 0.6); rim.position.set(6, 2, -6); scene.add(rim);

  // dust
  const N = 360, pos = new Float32Array(N * 3), spd = new Float32Array(N);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - .5) * 30; pos[i * 3 + 1] = (Math.random() - .5) * 14; pos[i * 3 + 2] = (Math.random() - .5) * 16 - 2; spd[i] = 0.002 + Math.random() * 0.006; }
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xd5dae1, size: 0.035, transparent: true, opacity: 0.5, depthWrite: false });
  scene.add(new THREE.Points(pGeo, pMat));

  let params: ProfileParams = { w: 90, h: 40, cells: 3, wall: 4.5 };
  const build = () => {
    if (profile) { group.remove(profile); profile.geometry.dispose(); }
    if (die) { group.remove(die); die.geometry.dispose(); }
    if (container) { group.remove(container); container.traverse(o => { if (o instanceof THREE.Mesh) o.geometry.dispose(); }); }
    const W = params.w * S, H = params.h * S, T = params.wall * S, cells = params.cells;
    // profile
    const shape = new THREE.Shape(); rr(shape, -W / 2, -H / 2, W, H, 0.22);
    const cw = (W - T * (cells + 1)) / cells, ch = H - 2 * T;
    if (cw > 0.05 && ch > 0.05) for (let i = 0; i < cells; i++) { const hole = new THREE.Path(); rr(hole, -W / 2 + T + i * (cw + T), -H / 2 + T, cw, ch, 0.1); shape.holes.push(hole); }
    profile = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 1, steps: 1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 10 }), alu);
    profile.scale.z = Math.max(0.001, len || 0.001);
    // die plate
    const dw = Math.max(5.6, W + 2.2), dh = Math.max(3.4, H + 1.8);
    const dieShape = new THREE.Shape(); rr(dieShape, -dw / 2, -dh / 2, dw, dh, 0.3);
    const opening = new THREE.Path(); rr(opening, -W / 2 - 0.05, -H / 2 - 0.05, W + 0.1, H + 0.1, 0.25); dieShape.holes.push(opening);
    die = new THREE.Mesh(new THREE.ExtrudeGeometry(dieShape, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 8 }), steel);
    die.position.z = -0.44;
    const d = die;
    ([[-1, -1], [1, -1], [-1, 1], [1, 1]] as const).forEach(([sx, sy]) => { const b = new THREE.Mesh(boltGeo, boltMat); b.rotation.x = Math.PI / 2; b.position.set(sx * (dw / 2 - 0.4), sy * (dh / 2 - 0.4), 0); d.add(b); });
    // press behind the die: container (holds the billet), ribs, stem and platen -> the visible source of the metal
    container = new THREE.Group();
    const R = Math.max(dw, dh) * 0.46;
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 7.5, 48), steelLight); tube.rotation.x = Math.PI / 2; tube.position.z = -0.44 - 3.75; container.add(tube);
    [-1.6, -4.0, -6.4].forEach(z => { const rib = new THREE.Mesh(new THREE.TorusGeometry(R + 0.06, 0.12, 12, 48), steel); rib.position.z = z; container!.add(rib); });
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.55, R * 0.55, 4.5, 40), steel); stem.rotation.x = Math.PI / 2; stem.position.z = -0.44 - 7.5 - 2.25; container.add(stem);
    const platen = new THREE.Mesh(new THREE.BoxGeometry(dw + 1.6, dh + 1.6, 0.9), steel); platen.position.z = -0.44 - 7.5 - 4.5 - 0.45; container.add(platen);
    const mouth = new THREE.Mesh(new THREE.RingGeometry(Math.max(W, H) * 0.5 + 0.1, R, 48), steel); mouth.position.z = -0.45; container.add(mouth);
    glow.scale.set(W + 0.8, H + 1, 1);
    group.add(profile, die, container);
  };
  build();

  let prog = 0, active = true, running = false, last = 0, mx = 0, my = 0, tx = 0, ty = 0, dolly = 0, disposed = false, raf = 0;
  const look = new THREE.Vector3(), tip = new THREE.Vector3();
  const stack = matchMedia(NARROW);
  const resize = () => {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    // stacked layout (the stage above the copy) wherever Config.tsx stacks it: the `narrow:` variant
    const stacked = stack.matches; group.position.set(stacked ? -1.2 : -1.1, stacked ? 1.2 : 0.3, 0);
  };
  addEventListener('resize', resize); resize();
  const onPointer = (e: PointerEvent) => { mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2; };
  if (fine) addEventListener('pointermove', onPointer, { passive: true });

  const tick = (t: number) => {
    if (disposed || !active) { running = false; return; }
    running = true;
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
    tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;
    len = REST_LEN + prog * (MAX_LEN - REST_LEN); // the camera backs away to keep the run-out in frame
    if (profile) profile.scale.z = len;
    brush.repeat.set(3, Math.max(1, len * 1.6));
    // die on the left, metal runs out to the right and toward the viewer
    group.rotation.y = 0.78 + tx * 0.06 + (reduced ? 0 : Math.sin(t / 6000) * 0.02);
    group.rotation.x = 0.08 + ty * 0.04;
    group.updateMatrixWorld(true);
    // the camera aims at a fixed spot just outside the die and does not move on its own;
    // it only dollies back when the projected tip of the run-out crosses 62% of the frame width
    const narrow = camera.aspect < 1, baseZ = narrow ? 15 : 12.5;
    if (profile) { look.set(0, 0, Math.min(1, 1.1 / len)); profile.localToWorld(look); } // a fixed world spot 1.1 units past the die
    // where does the run-out tip land with the camera where it is now? if it passes 62% of the frame width
    // (or gets close to the lens) back off by exactly the missing amount; if it falls back under 45%, ease in again
    camera.position.set(0.9 + dolly * 0.08, 1.5 + dolly * 0.16, baseZ + dolly); camera.lookAt(look.x + 0.6, look.y - 0.15, look.z); camera.updateMatrixWorld();
    let want = dolly;
    if (profile) {
      tip.set(0, 0, 1); profile.localToWorld(tip);
      const depth = -tip.clone().applyMatrix4(camera.matrixWorldInverse).z;
      const ndcX = tip.project(camera).x;
      if (depth < 1.5) want = dolly + 6;
      else if (ndcX > 0.62) want = dolly + depth * (ndcX / 0.62 - 1);
      else if (ndcX < 0.45 && dolly > 0) want = dolly - depth * (1 - ndcX / 0.45) * 0.5;
    }
    dolly = Math.max(0, Math.min(220, dolly + (want - dolly) * Math.min(1, dt * 6)));
    camera.position.set(0.9 + dolly * 0.08, 1.5 + dolly * 0.16, baseZ + dolly);
    camera.lookAt(look.x + 0.6, look.y - 0.15, look.z);
    const heat = 1 - prog * 0.35; hot.intensity = 3.4 * heat; glowMat.opacity = 0.7 * heat;
    const arr = pGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < N; i++) { arr[i * 3 + 1] += spd[i] * dt * 9; if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = -7; }
    pGeo.attributes.position.needsUpdate = true;
    if (compiled) renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  api.setParams = (p) => { params = { ...params, ...p }; build(); };
  api.setProgress = (p) => { prog = Math.min(1, Math.max(0, p)); };
  api.setLight = v => { gsap.to(mode, { v: v ? 1 : 0, duration: reduced ? 0 : 0.6, ease: 'power2.inOut', overwrite: true, onUpdate: applyLook }); };
  api.setActive = (v) => { active = v; if (v && !running && !disposed) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  api.destroy = () => {
    if (disposed) return;
    disposed = true; running = false; cancelAnimationFrame(raf); gsap.killTweensOf(mode);
    removeEventListener('resize', resize);
    removeEventListener('pointermove', onPointer);
    profile?.geometry.dispose(); die?.geometry.dispose();
    container?.traverse(o => { if (o instanceof THREE.Mesh) o.geometry.dispose(); });
    [alu, steel, steelLight, boltMat, glowMat, pMat].forEach(m => m.dispose());
    [brush, glowTex].forEach(t => t.dispose());
    boltGeo.dispose(); pGeo.dispose(); envRT.dispose();
    // no forceContextLoss(): React may remount onto this same <canvas> (StrictMode does in dev),
    // and a canvas whose context was forcibly lost hands that dead context back to the next renderer
    renderer.dispose();
  };
  // compile the shaders without blocking, then start drawing
  let compiled = false;
  renderer.compileAsync(scene, camera).then(() => { compiled = true; }, () => { compiled = true; });
  api.setActive(true);
  return api;
}
