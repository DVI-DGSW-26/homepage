// Profile lab: a multi-hollow profile pushed out of a die by a press.
// Scene units are mm / 25. The canvas spans the whole section; the die sits left of centre and the
// profile runs out to the right, toward the camera, while the camera dollies back so it always fits.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const S = 1 / 25;
const rr = (p, x, y, w, h, r) => {
  r = Math.min(r, w / 2, h / 2);
  p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r);
  p.lineTo(x + w, y + h - r); p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  p.lineTo(x + r, y + h); p.quadraticCurveTo(x, y + h, x, y + h - r);
  p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y);
};

export function metricsFor({ w, h, cells, wall }) {
  const cw = (w - wall * (cells + 1)) / cells, ch = h - 2 * wall;
  const area = Math.max(0, w * h - cells * Math.max(0, cw) * Math.max(0, ch)); // mm²
  const kgPerM = area * 1000 * 2.7e-6; // AL density 2.7 g/cm³
  const ccd = Math.sqrt(w * w + h * h);
  const press = ccd <= 120 ? { inch: 6, ton: 1450 } : { inch: 10, ton: 3500 };
  return { area, kgPerM, ccd, press, cw, ch };
}

const ACC = 0x8a5bc2, ACC_GLOW = 'rgba(158,110,220,';

export function createExtrusion(canvas, { reduced = false, fine = true } = {}) {
  const api = { setParams() {}, setProgress() {}, getProgress: () => 0, setActive() {}, warm() {}, length: 0 };
  let params = { w: 90, h: 40, cells: 3, wall: 4.5 }, prog = 0, active = false, running = false, last = 0;
  let made = null, failed = false;
  // The section sits many screens below the hero, so nothing here (context, environment bake, geometry,
  // shader links) is built until it is first needed or warm() is called from an idle moment.
  const setup = () => {
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
    catch (e) { failed = true; canvas.remove(); return null; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, (navigator.hardwareConcurrency || 8) <= 4 ? 1.25 : 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 600);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // brushed die-line texture; repeat along the length is tied to the length so the pattern
    // travels WITH the metal instead of stretching (reads as "pushed out", not "pulled")
    const brush = (() => {
      const c = document.createElement('canvas'); c.width = 512; c.height = 64; const g = c.getContext('2d');
      g.fillStyle = '#808080'; g.fillRect(0, 0, 512, 64);
      for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${Math.random() > .5 ? 255 : 0},${Math.random() > .5 ? 255 : 0},${Math.random() > .5 ? 255 : 0},${Math.random() * .35})`; g.fillRect(Math.random() * 512, 0, Math.random() < .8 ? 1 : 2, 64); }
      const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 1); t.anisotropy = renderer.capabilities.getMaxAnisotropy(); return t;
    })();
    const alu = new THREE.MeshStandardMaterial({ color: 0xd9dee5, metalness: 1, roughness: 0.3, bumpMap: brush, bumpScale: 0.006, envMapIntensity: 1.2 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x1e232b, metalness: 0.92, roughness: 0.6, envMapIntensity: 0.55 });
    const steelLight = new THREE.MeshStandardMaterial({ color: 0x3a414c, metalness: 0.9, roughness: 0.5, envMapIntensity: 0.6 });

    const group = new THREE.Group(); scene.add(group);
    let profile = null, die = null, container = null;
    const hot = new THREE.PointLight(ACC, 0, 6.5, 2); hot.position.set(0, 0, 0.35); group.add(hot);
    const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, ACC_GLOW + '0.9)'); gr.addColorStop(.35, ACC_GLOW + '0.35)'); gr.addColorStop(1, ACC_GLOW + '0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 })); glow.position.z = 0.05; group.add(glow);
    const boltGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.06, 12);
    const boltMat = new THREE.MeshStandardMaterial({ color: 0x9aa3af, metalness: 1, roughness: 0.35 });

    const key = new THREE.DirectionalLight(0xffffff, 0.9); key.position.set(-4, 6, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0xc9b8ff, 0.6); rim.position.set(6, 2, -6); scene.add(rim);

    // dust
    const N = 360, pos = new Float32Array(N * 3), spd = new Float32Array(N);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - .5) * 30; pos[i * 3 + 1] = (Math.random() - .5) * 14; pos[i * 3 + 2] = (Math.random() - .5) * 16 - 2; spd[i] = 0.002 + Math.random() * 0.006; }
    const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xd5dae1, size: 0.035, transparent: true, opacity: 0.5, depthWrite: false })));

    const build = () => {
      if (profile) { group.remove(profile); profile.geometry.dispose(); }
      if (die) { group.remove(die); die.geometry.dispose(); }
      if (container) { group.remove(container); container.traverse(o => o.geometry && o.geometry.dispose()); }
      const W = params.w * S, H = params.h * S, T = params.wall * S, cells = params.cells;
      // profile
      const shape = new THREE.Shape(); rr(shape, -W / 2, -H / 2, W, H, 0.22);
      const cw = (W - T * (cells + 1)) / cells, ch = H - 2 * T;
      if (cw > 0.05 && ch > 0.05) for (let i = 0; i < cells; i++) { const hole = new THREE.Path(); rr(hole, -W / 2 + T + i * (cw + T), -H / 2 + T, cw, ch, 0.1); shape.holes.push(hole); }
      profile = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 1, steps: 1, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 10 }), alu);
      profile.scale.z = Math.max(0.001, api._len || 0.001);
      // die plate
      const dw = Math.max(5.6, W + 2.2), dh = Math.max(3.4, H + 1.8);
      const dieShape = new THREE.Shape(); rr(dieShape, -dw / 2, -dh / 2, dw, dh, 0.3);
      const opening = new THREE.Path(); rr(opening, -W / 2 - 0.05, -H / 2 - 0.05, W + 0.1, H + 0.1, 0.25); dieShape.holes.push(opening);
      die = new THREE.Mesh(new THREE.ExtrudeGeometry(dieShape, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 8 }), steel);
      die.position.z = -0.44;
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { const b = new THREE.Mesh(boltGeo, boltMat); b.rotation.x = Math.PI / 2; b.position.set(sx * (dw / 2 - 0.4), sy * (dh / 2 - 0.4), 0); die.add(b); });
      // press behind the die: container (holds the billet), ribs, stem and platen -> the visible source of the metal
      container = new THREE.Group();
      const R = Math.max(dw, dh) * 0.46;
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 7.5, 48), steelLight); tube.rotation.x = Math.PI / 2; tube.position.z = -0.44 - 3.75; container.add(tube);
      [-1.6, -4.0, -6.4].forEach(z => { const rib = new THREE.Mesh(new THREE.TorusGeometry(R + 0.06, 0.12, 12, 48), steel); rib.position.z = z; container.add(rib); });
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.55, R * 0.55, 4.5, 40), steel); stem.rotation.x = Math.PI / 2; stem.position.z = -0.44 - 7.5 - 2.25; container.add(stem);
      const platen = new THREE.Mesh(new THREE.BoxGeometry(dw + 1.6, dh + 1.6, 0.9), steel); platen.position.z = -0.44 - 7.5 - 4.5 - 0.45; container.add(platen);
      const mouth = new THREE.Mesh(new THREE.RingGeometry(Math.max(W, H) * 0.5 + 0.1, R, 48), steel); mouth.position.z = -0.45; container.add(mouth);
      glow.scale.set(W + 0.8, H + 1, 1);
      group.add(profile, die, container);
    };
    build();

    let mx = 0, my = 0, tx = 0, ty = 0, dolly = 0;
    const look = new THREE.Vector3(), tip = new THREE.Vector3();
    const resize = () => {
      const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      const narrow = w < 900; group.position.set(narrow ? -1.2 : -1.1, narrow ? 1.2 : 0.3, 0);
    };
    addEventListener('resize', resize); resize();
    if (fine) addEventListener('pointermove', e => { mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2; }, { passive: true });

    const tick = (t) => {
      if (!active) { running = false; return; }
      running = true;
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
      tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;
      const len = 0.35 + prog * 42; api._len = len; api.length = len; // a very long run-out; the camera backs away to keep it in frame
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
      const heat = 1 - prog * 0.35; hot.intensity = 3.4 * heat; glow.material.opacity = 0.7 * heat;
      const arr = pGeo.attributes.position.array;
      for (let i = 0; i < N; i++) { arr[i * 3 + 1] += spd[i] * dt * 9; if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = -7; }
      pGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
  return { build, tick, renderer, scene, camera };
  };
  const ensure = () => { if (!made && !failed) made = setup(); return made; };
  api.setParams = (p) => { params = { ...params, ...p }; if (made) made.build(); };
  api.setProgress = (p) => { prog = Math.min(1, Math.max(0, p)); };
  api.getProgress = () => prog;
  api.setActive = (v) => { active = v; if (!v) return; const m = ensure(); if (m && !running) { last = performance.now(); requestAnimationFrame(m.tick); } };
  // build the scene and link its programs ahead of time, off the critical path
  api.warm = () => { const m = ensure(); if (m) { try { m.renderer.compileAsync(m.scene, m.camera).catch(() => {}); } catch (e) {} } };
  return api;
}
