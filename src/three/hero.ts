// Hero: a cloud of aluminum "chips" that assembles into DVISION automotive parts,
// reacts to the pointer, and crystallises into brushed metal once settled.
import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { makeParts } from './parts';
import { token } from '../lib/tokens';

const VERT = /* glsl */`
attribute vec3 aP0; attribute vec3 aP1; attribute vec3 aP2; attribute vec3 aP3;
attribute vec3 aScatter; attribute float aRand;
uniform int uFrom; uniform int uTo; uniform float uMix; uniform float uIntro; uniform float uTime;
uniform vec3 uPointer; uniform vec3 uAxis; uniform float uPush; uniform float uSize; uniform float uDpr;
varying float vA; varying float vHeat; varying float vSpark;
vec3 pick(int i){ if(i==0) return aP0; if(i==1) return aP1; if(i==2) return aP2; return aP3; }
void main(){
  vec3 a = pick(uFrom); vec3 b = pick(uTo);
  float t = smoothstep(0.0, 1.0, clamp((uMix - aRand * 0.35) / 0.65, 0.0, 1.0));
  vec3 p = mix(a, b, t);
  float lift = sin(t * 3.14159) * (0.5 + aRand * 0.9);
  vec3 dir = normalize(vec3(sin(aRand * 40.0), cos(aRand * 31.0), sin(aRand * 17.0)) + vec3(0.001));
  p += dir * lift;
  float it = smoothstep(0.0, 1.0, clamp((uIntro - aRand * 0.4) / 0.6, 0.0, 1.0));
  p = mix(aScatter, p, it);
  p += 0.012 * vec3(sin(uTime * 0.9 + aRand * 20.0), cos(uTime * 1.1 + aRand * 13.0), sin(uTime * 0.7 + aRand * 7.0));
  vec3 d = p - uPointer; float dist = length(d);
  float f = smoothstep(1.7, 0.0, dist) * uPush;
  vec3 tang = cross(uAxis, d); float tl = length(tang); tang = tl > 0.0001 ? tang / tl : vec3(0.0);
  float swirl = f * (0.85 + 0.35 * sin(uTime * 2.6 + aRand * 6.2832));
  p += tang * swirl * 0.85 + uAxis * f * 0.55 + normalize(d + vec3(0.0001)) * f * 0.1;
  vHeat = f;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uSize * uDpr * (0.7 + aRand * 0.9) * (5.0 / -mv.z) * (1.0 + f * 0.9);
  gl_Position = projectionMatrix * mv;
  vA = 0.5 + 0.5 * aRand;
  vSpark = step(0.9, aRand);
}`;
const FRAG = /* glsl */`
precision highp float;
uniform float uOpacity; uniform float uLight; uniform vec3 uChip, uChipLight, uSpark, uSparkLight; varying float vA; varying float vHeat; varying float vSpark;
void main(){
  vec2 c = gl_PointCoord - 0.5; float d = length(c); if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.12, d);
  // bright chips on graphite; on the light page they turn to darker, anodized-looking metal
  vec3 chip = mix(uChip, uChipLight, uLight);
  vec3 spark = mix(uSpark, uSparkLight, uLight);
  vec3 col = mix(chip, spark, max(vHeat, vSpark * 0.85));
  col *= 0.7 + 0.3 * vA;
  gl_FragColor = vec4(col, a * uOpacity * (0.5 + 0.5 * vA));
}`;

/** a colour token as plain 0–1 channels for a shader uniform */
const raw = (name: string) => new THREE.Color().setStyle(token(name), THREE.LinearSRGBColorSpace);

/** one part per headline beat */
const PARTS = 4;

export interface HeroApi { setLight(v: boolean): void; setBeat(i: number): void; setIntro(v: number): void; setProgress(p: number): void; setActive(v: boolean): void; destroy(): void }

export function createHero(canvas: HTMLCanvasElement, { reduced = false, fine = true, light = false }: { reduced?: boolean; fine?: boolean; light?: boolean } = {}): HeroApi {
  const api: HeroApi = { setLight() {}, setBeat() {}, setIntro() {}, setProgress() {}, setActive() {}, destroy() {} };
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
  catch { canvas.style.display = 'none'; return api; }
  const DPR = Math.min(window.devicePixelRatio || 1, (navigator.hardwareConcurrency || 8) <= 4 ? 1.25 : 1.5);
  renderer.setPixelRatio(DPR);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.set(0, 0.2, 7.6);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  pmrem.dispose();

  const key = new THREE.DirectionalLight(token('--scene-key'), 1.2); key.position.set(-3, 5, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(token('--scene-rim'), 0.7); rim.position.set(5, -2, -4); scene.add(rim);

  const group = new THREE.Group(); scene.add(group);
  const parts = makeParts(PARTS);
  const N = 15000;
  const geo = new THREE.BufferGeometry();
  const tmp = new THREE.Vector3();
  // Scattering 15k points over a surface is the most expensive thing the page does at start-up,
  // so only the first part is sampled now; the others fill in while the browser is idle, and a
  // beat that arrives before its part is ready samples it on the spot.
  const sampled = new Set<number>();
  const sample = (k: number) => {
    if (sampled.has(k)) return; sampled.add(k);
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(parts[k].geo)).build();
    const attr = geo.getAttribute('aP' + k) as THREE.BufferAttribute, arr = attr.array as Float32Array;
    for (let i = 0; i < N; i++) { sampler.sample(tmp); arr[i * 3] = tmp.x; arr[i * 3 + 1] = tmp.y; arr[i * 3 + 2] = tmp.z; }
    attr.needsUpdate = true;
  };
  for (let k = 0; k < PARTS; k++) geo.setAttribute('aP' + k, new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  sample(0);
  geo.setAttribute('position', new THREE.BufferAttribute((geo.getAttribute('aP0').array as Float32Array).slice(), 3));
  const hasIdle = typeof requestIdleCallback === 'function';
  const idle = (fn: () => void) => (hasIdle ? requestIdleCallback(fn, { timeout: 2000 }) : window.setTimeout(fn, 200));
  let idleId = 0;
  const sampleRest = (k: number) => { if (disposed || k >= PARTS) return; idleId = idle(() => { sample(k); sampleRest(k + 1); }); };
  const scatter = new Float32Array(N * 3), rand = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const r = 2.5 + Math.random() * 5, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    scatter[i * 3] = r * Math.sin(ph) * Math.cos(th); scatter[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6; scatter[i * 3 + 2] = r * Math.cos(ph) - 2;
    rand[i] = Math.random();
  }
  geo.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3));
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);

  const uniforms = {
    uFrom: { value: 0 }, uTo: { value: 0 }, uMix: { value: 0 }, uIntro: { value: reduced ? 1 : 0 }, uTime: { value: 0 },
    uPointer: { value: new THREE.Vector3(99, 99, 99) }, uAxis: { value: new THREE.Vector3(0, 0, 1) }, uPush: { value: 0 }, uSize: { value: 2.6 }, uDpr: { value: DPR }, uOpacity: { value: 1 }, uLight: { value: light ? 1 : 0 },
    // the shader writes these straight out, so they go in unconverted (as the hex reads), not linearised
    uChip: { value: raw('--scene-chip') }, uChipLight: { value: raw('--scene-chip-light') },
    uSpark: { value: raw('--scene-spark') }, uSparkLight: { value: raw('--scene-spark-light') }
  };
  const pointsMat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: false, depthTest: false });
  const points = new THREE.Points(geo, pointsMat);
  group.add(points);

  const alu = () => new THREE.MeshPhysicalMaterial({ color: token('--scene-alu'), metalness: 1, roughness: 0.3, envMapIntensity: 1.15, transparent: true, opacity: 0, clearcoat: 0.15, clearcoatRoughness: 0.4 });
  const meshes = parts.map(p => { const m = new THREE.Mesh(p.geo, alu()); m.visible = false; group.add(m); return m; });
  // Light mode: the same aluminum would vanish against the pale page, so the solids darken and
  // reflect less, and the chips follow (uLight). The switch eases over the page's crossfade.
  const DARK_ALU = new THREE.Color(token('--scene-alu')), LIGHT_ALU = new THREE.Color(token('--scene-alu-light'));
  const look = { v: light ? 1 : 0 };
  const applyLook = () => {
    uniforms.uLight.value = look.v;
    meshes.forEach(m => { m.material.color.copy(DARK_ALU).lerp(LIGHT_ALU, look.v); m.material.envMapIntensity = 1.15 - look.v * 0.35; });
  };
  applyLook();
  api.setLight = v => { gsap.to(look, { v: v ? 1 : 0, duration: reduced ? 0 : 0.6, ease: 'power2.inOut', overwrite: true, onUpdate: applyLook }); };

  let cur = 0, active = true, running = false, last = 0, prog = 0, progTo = 0, introDone = false, disposed = false, raf = 0;
  const mouse = new THREE.Vector2(9, 9), ray = new THREE.Raycaster(), plane = new THREE.Plane(), hit = new THREE.Vector3(), target = new THREE.Vector3(99, 99, 99);
  let pushTo = 0, idleT = 0;
  const camDir = new THREE.Vector3(), gPos = new THREE.Vector3(), qInv = new THREE.Quaternion();
  const resize = () => {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    const narrow = w < 860; group.position.set(narrow ? 0 : 1.75, narrow ? 1.1 : 0.35, 0);
    group.scale.setScalar(narrow ? 0.72 : 1);
  };
  addEventListener('resize', resize); resize();
  const onPointer = (e: PointerEvent) => { mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); pushTo = 1; idleT = 0; };
  if (fine) addEventListener('pointermove', onPointer, { passive: true });

  const showSolid = (k: number, on: boolean, delay = 0) => {
    const m = meshes[k];
    if (on) m.visible = true;
    gsap.to(m.material, { opacity: on ? 0.96 : 0, duration: on ? 0.4 : 0.15, delay, ease: on ? 'power2.out' : 'power2.in', overwrite: true, onComplete: () => { if (!on) m.visible = false; } });
  };
  // initial state: first part assembled by intro, solid revealed after intro
  api.setIntro = (v) => { uniforms.uIntro.value = v; if (v >= 0.999 && !meshes[0].visible && cur === 0 && !introDone) { introDone = true; showSolid(0, true, 0.1); gsap.to(uniforms.uOpacity, { value: 0.55, duration: 0.7, delay: 0.1 }); } };
  if (reduced) { introDone = true; meshes[0].visible = true; meshes[0].material.opacity = 0.96; uniforms.uOpacity.value = 0.55; }

  api.setBeat = (k) => {
    if (k === cur || k < 0 || k >= parts.length) return;
    sample(k);
    const from = cur; cur = k;
    gsap.killTweensOf(uniforms.uMix); gsap.killTweensOf(uniforms.uOpacity);
    showSolid(from, false);
    uniforms.uFrom.value = from; uniforms.uTo.value = k; uniforms.uMix.value = 0;
    gsap.to(uniforms.uOpacity, { value: 1, duration: 0.15 });
    gsap.to(uniforms.uMix, { value: 1, duration: 0.6, ease: 'power2.inOut', onComplete: () => {
      uniforms.uFrom.value = k; uniforms.uMix.value = 0;
      if (cur === k) { showSolid(k, true); gsap.to(uniforms.uOpacity, { value: 0.55, duration: 0.4 }); }
    } });
  };
  api.setProgress = (p) => { progTo = p; };
  api.setActive = (v) => { active = v; if (v && !running && !disposed) { last = performance.now(); raf = requestAnimationFrame(tick); } };

  const tick = (t: number) => {
    if (disposed || !active) { running = false; return; }
    running = true;
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
    uniforms.uTime.value = t / 1000;
    // pointer -> plane through group origin facing camera -> local
    if (fine) {
      idleT += dt; if (idleT > 1.6) pushTo = 0;
      uniforms.uPush.value += (pushTo - uniforms.uPush.value) * 0.08;
      ray.setFromCamera(mouse, camera);
      camera.getWorldDirection(camDir).negate();
      plane.setFromNormalAndCoplanarPoint(camDir, group.getWorldPosition(gPos));
      if (ray.ray.intersectPlane(plane, hit)) { group.worldToLocal(hit); target.copy(hit); }
      uniforms.uPointer.value.lerp(target, 0.14);
      group.getWorldQuaternion(qInv).invert(); uniforms.uAxis.value.copy(camDir).applyQuaternion(qInv).normalize();
    }
    if (!reduced) {
      group.rotation.y += dt * 0.22;
      group.rotation.x = 0.28 + Math.sin(t / 2600) * 0.08 + (fine ? -mouse.y * 0.12 : 0);
      group.rotation.z = Math.sin(t / 3900) * 0.06;
    } else { group.rotation.set(0.3, 0.6, 0); }
    // the camera eases toward whatever setProgress() last asked for (the page currently leaves it at 0)
    prog += (progTo - prog) * Math.min(1, dt * 8);
    camera.position.y = 0.2 - prog * 1.6; camera.position.x = prog * 0.6;
    camera.lookAt(group.position.x * 0.5, group.position.y * 0.5, 0);
    if (compiled) renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  api.destroy = () => {
    if (disposed) return;
    disposed = true; running = false; cancelAnimationFrame(raf);
    if (hasIdle) cancelIdleCallback(idleId); else clearTimeout(idleId);
    removeEventListener('resize', resize);
    removeEventListener('pointermove', onPointer);
    gsap.killTweensOf([look, uniforms.uMix, uniforms.uOpacity, ...meshes.map(m => m.material)]);
    geo.dispose(); pointsMat.dispose();
    meshes.forEach(m => m.material.dispose());
    parts.forEach(p => p.geo.dispose());
    envRT.dispose();
    // no forceContextLoss(): React may remount onto this same <canvas> (StrictMode does in dev),
    // and a canvas whose context was forcibly lost hands that dead context back to the next renderer
    renderer.dispose();
  };
  // Compile every shader up front without blocking (KHR_parallel_shader_compile where available).
  // compile() only visits visible objects, so the solids — hidden until a beat settles — are shown
  // for the duration of the call; otherwise their first appearance would stall a frame mid-scroll.
  let compiled = false;
  meshes.forEach(m => { m.visible = true; });
  renderer.compileAsync(scene, camera).then(() => { compiled = true; }, () => { compiled = true; });
  meshes.forEach((m, k) => { m.visible = k === 0 && reduced; });
  api.setActive(true);
  sampleRest(1);
  return api;
}
