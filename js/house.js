// Procedural low-poly modern luxury two-storey house rendered with three.js.
// Front elevation faces +z (toward the camera at rx = ry = 0). Built from a plain data spec of boxes so the
// part centres (PART_CENTER) and exploded offsets are computed from the same numbers the meshes use.
import * as THREE from "three";

export const PARTS = ["foundation", "slab", "walls", "windows", "door", "roof"];

import { STAGE } from "./scenes/util.js";
const STAGE_W = STAGE.w, STAGE_H = STAGE.h;
const BONE = 0xf2efea, SAGE = 0x557373;

// Exploded-view offsets of each part group (model units at ex = 1).
const EXPLODE = {
  foundation: [0, -1.1, 0], slab: [0, -0.55, 0], walls: [0, 0, 0],
  windows: [0, 0, 1.6], door: [0, 0, 2.1], roof: [0, 1.5, 0],
};
// Extra per-piece offsets inside a part (also scaled by ex) so the storeys separate cleanly:
const UPPER = [0, 0.9, 0];          // upper storey walls + its windows lift
const UPPER_SLAB = [0, 1.0, 0];     // upper floor slab ends up between the storeys (net +0.45)
const SIDE_GLASS = [1.1, 0.9, -1.6]; // +x side glazing slides out sideways instead of forward

// ---------------------------------------------------------------- data spec
// box(x0, x1, y0, y1, z0, z1, material, { sub, anchor, edges })
const box = (x0, x1, y0, y1, z0, z1, m, o = {}) => ({ b: [x0, x1, y0, y1, z0, z1], m, ...o });

// window frame on a z-facing plane: perimeter bars + vertical mullions at the given x positions
function frameZ(x0, x1, y0, y1, z0, z1, mullions, o = {}) {
  const t = 0.05, m = "frame", e = { edges: false, ...o };
  const out = [
    box(x0, x1, y1 - t, y1, z0, z1, m, e), box(x0, x1, y0, y0 + t, z0, z1, m, e),
    box(x0, x0 + t, y0, y1, z0, z1, m, e), box(x1 - t, x1, y0, y1, z0, z1, m, e),
  ];
  for (const x of mullions) out.push(box(x - t / 2, x + t / 2, y0, y1, z0, z1, m, e));
  return out;
}
// same on an x-facing plane (mullions at z positions)
function frameX(x0, x1, y0, y1, z0, z1, mullions, o = {}) {
  const t = 0.05, m = "frame", e = { edges: false, ...o };
  const out = [
    box(x0, x1, y1 - t, y1, z0, z1, m, e), box(x0, x1, y0, y0 + t, z0, z1, m, e),
    box(x0, x1, y0, y1, z0, z0 + t, m, e), box(x0, x1, y0, y1, z1 - t, z1, m, e),
  ];
  for (const z of mullions) out.push(box(x0, x1, y0, y1, z - t / 2, z + t / 2, m, e));
  return out;
}

const BATTENS = [-1.35, -0.8, -0.25, 0.3, 0.85].map((z) =>
  box(2.7, 2.75, -1.75, 0, z - 0.04, z + 0.04, "timber"));

const SPEC = {
  foundation: [
    box(-3.0, 3.0, -2.25, -1.95, -2.0, 2.0, "concrete"),       // plinth
    box(1.3, 2.25, -2.25, -2.1, 2.0, 2.5, "concrete"),         // entry step, low
    box(1.3, 2.25, -2.1, -1.95, 2.0, 2.25, "concrete"),        // entry step, high
  ],
  slab: [
    box(-2.9, 2.9, -1.95, -1.8, -1.9, 1.9, "concrete", { anchor: true }), // ground slab
    // pool on the terrace under the cantilever: coping ring + water
    box(-2.7, -0.5, -1.8, -1.72, 1.75, 1.85, "concrete"),
    box(-2.7, -0.5, -1.8, -1.72, 0.88, 0.98, "concrete"),
    box(-2.7, -2.6, -1.8, -1.72, 0.98, 1.75, "concrete"),
    box(-0.6, -0.5, -1.8, -1.72, 0.98, 1.75, "concrete"),
    box(-2.6, -0.6, -1.8, -1.755, 0.98, 1.75, "water", { edges: false }),
    // upper floor slab, cantilevered forward over the pool, with a glass-railed terrace on the right
    box(-3.0, 2.75, 0.05, 0.25, -1.8, 2.0, "concrete", { sub: UPPER_SLAB }),
    box(2.0, 2.72, 0.25, 0.8, 1.94, 1.98, "railing", { sub: UPPER_SLAB }),
    box(2.68, 2.72, 0.25, 0.8, -1.7, 1.94, "railing", { sub: UPPER_SLAB }),
  ],
  walls: [
    box(-2.75, 1.2, -1.8, 0.05, -1.7, 0.8, "bone"),            // ground volume (set back)
    box(-2.95, -2.75, -1.8, 0.05, -1.7, 1.9, "bone"),          // blade wall beside the pool
    box(1.2, 2.7, -1.8, 0.05, -1.7, 1.5, "timber"),            // dark timber entry volume
    ...BATTENS,
    box(-2.9, 2.0, 0.25, 1.95, -1.7, 1.9, "bone", { sub: UPPER }), // upper volume
  ],
  windows: [
    // ground floor glazing wall
    box(-2.6, 1.05, -1.72, -0.1, 0.8, 0.83, "glass", { anchor: true }),
    ...frameZ(-2.6, 1.05, -1.72, -0.1, 0.8, 0.86, [-1.38, -0.17]),
    // upper ribbon window
    box(-2.6, 1.7, 0.55, 1.7, 1.9, 1.93, "glass", { sub: UPPER, anchor: true }),
    ...frameZ(-2.6, 1.7, 0.55, 1.7, 1.9, 1.96, [-1.525, -0.45, 0.625], { sub: UPPER }),
    // slot window in the timber volume
    box(2.25, 2.55, -1.55, -0.25, 1.5, 1.53, "glass", { anchor: true }),
    // upper side glazing onto the terrace (+x face)
    box(2.0, 2.03, 0.3, 1.85, -1.3, 1.5, "glass", { sub: SIDE_GLASS }),
    ...frameX(2.0, 2.06, 0.3, 1.85, -1.3, 1.5, [0.1], { sub: SIDE_GLASS }),
  ],
  door: [
    box(1.52, 2.03, -1.8, -0.22, 1.5, 1.56, "bronze"),         // tall pivot leaf
    box(1.47, 2.08, -0.22, -0.17, 1.5, 1.58, "frame"),
    box(1.47, 1.52, -1.8, -0.17, 1.5, 1.58, "frame"),
    box(2.03, 2.08, -1.8, -0.17, 1.5, 1.58, "frame"),
    box(1.9, 1.93, -1.45, -0.55, 1.56, 1.63, "metal", { edges: false }), // pull bar
  ],
  roof: [
    box(-3.1, 2.15, 1.95, 2.07, -1.85, 2.05, "roof"),          // thin flat roof with overhang
    box(-3.1, 2.15, 2.07, 2.22, 1.97, 2.05, "roof"),           // parapet front
    box(-3.1, 2.15, 2.07, 2.22, -1.85, -1.77, "roof"),         // parapet back
    box(-3.1, -3.02, 2.07, 2.22, -1.77, 1.97, "roof"),         // parapet left
    box(2.07, 2.15, 2.07, 2.22, -1.77, 1.97, "roof"),          // parapet right
    box(-3.02, 2.07, 2.07, 2.085, -1.77, 1.97, "membrane", { edges: false }),
    box(-1.2, 0.2, 2.085, 2.16, -0.9, 0.3, "glass"),           // skylight
  ],
};

// bbox centre of a part's anchor pieces (all pieces when none is flagged) with sub offsets at `ex`
function anchorCentre(name, ex) {
  const items = SPEC[name];
  const pick = items.some((it) => it.anchor) ? items.filter((it) => it.anchor) : items;
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (const it of pick) {
    const s = it.sub || [0, 0, 0];
    for (let a = 0; a < 3; a++) {
      lo[a] = Math.min(lo[a], it.b[a * 2] + s[a] * ex);
      hi[a] = Math.max(hi[a], it.b[a * 2 + 1] + s[a] * ex);
    }
  }
  return lo.map((v, a) => (v + hi[a]) / 2);
}
const round3 = (v) => Math.round(v * 1000) / 1000;

// assembled part centres [x, y] in model units (front view, s = 1, before pose)
export const PART_CENTER = Object.fromEntries(PARTS.map((n) => [n, anchorCentre(n, 0).slice(0, 2).map(round3)]));

// ---------------------------------------------------------------- materials (one set per part, so highlight is local)
const MAT_DEF = {
  concrete: { color: 0x8f8a83, metalness: 0, roughness: 0.92 },
  bone: { color: 0xdcd8d0, metalness: 0, roughness: 0.8 },
  timber: { color: 0x3a281c, metalness: 0, roughness: 0.82 },
  glass: { color: 0x11161b, metalness: 0.8, roughness: 0.1, emissive: SAGE, emissiveIntensity: 0.012 },
  frame: { color: 0x1d1e20, metalness: 0.6, roughness: 0.45 },
  water: { color: 0x0f3a44, metalness: 0.3, roughness: 0.08, emissive: 0x06262c, emissiveIntensity: 1 },
  railing: { color: 0x9fb2b8, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.32, depthWrite: false },
  bronze: { color: 0x8a6747, metalness: 0.55, roughness: 0.42 },
  metal: { color: 0xd9d4cb, metalness: 0.85, roughness: 0.3 },
  roof: { color: 0xc9c4bb, metalness: 0, roughness: 0.82 },
  membrane: { color: 0x2b2b2c, metalness: 0, roughness: 0.92 },
};
const FOUNDATION_TINT = 0x5f5c58; // the plinth reads darker than the slabs

function makePartMaterials(name) {
  const cache = {};
  return (key) => {
    if (!cache[key]) {
      const def = { ...MAT_DEF[key] };
      if (name === "foundation" && key === "concrete") def.color = FOUNDATION_TINT;
      const m = new THREE.MeshStandardMaterial(def);
      m.userData.baseEmissive = m.emissive.getHex();
      m.userData.baseIntensity = m.emissiveIntensity;
      cache[key] = m;
    }
    return cache[key];
  };
}

// ---------------------------------------------------------------- environment (soft boxes for glass reflections)
function makeEnvironment(renderer) {
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40),
    new THREE.MeshBasicMaterial({ color: 0x08080a, side: THREE.BackSide })));
  const panel = (w, h, pos, r, g, b) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color().setRGB(r, g, b), side: THREE.DoubleSide }));
    mesh.position.set(...pos);
    mesh.lookAt(0, 0, 0);
    env.add(mesh);
  };
  panel(22, 5, [0, 14, 6], 4, 4, 4);        // sky softbox
  panel(3, 14, [-14, 2, 5], 2.4, 2.4, 2.5); // left strip
  panel(3, 12, [13, 0, -8], 4, 1.2, 0);     // sage rim strip
  panel(18, 2, [0, -10, 4], 0.6, 0.6, 0.6); // ground bounce
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(env, 0.03).texture;
  pm.dispose();
  env.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
  return tex;
}

function boxGeometry([x0, x1, y0, y1, z0, z1]) {
  const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
  g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  return g;
}

// ---------------------------------------------------------------- mount
export async function mountHouse(canvas, state, opts = {}) {
  const interactive = opts.interactive !== false;
  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: true, powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  const applyPixelRatio = (n) => {
    renderer.setPixelRatio(THREE.MathUtils.clamp(Number(n) || 1, 0.5, 3));
    renderer.setSize(STAGE_W, STAGE_H, false);
  };
  applyPixelRatio(opts.pixelRatio || 1);

  const scene = new THREE.Scene();
  scene.environment = makeEnvironment(renderer);

  const camera = new THREE.PerspectiveCamera(30, STAGE_W / STAGE_H, 0.1, 60);
  camera.position.set(0, 0, 14);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);

  // lights live outside the root so they do not rotate with the house
  const key = new THREE.DirectionalLight(0xf4efe6, 2.1);
  key.position.set(-5, 8, 9);
  const back = new THREE.DirectionalLight(SAGE, 0.7);
  back.position.set(6, 3, -6);
  const cursorLight = new THREE.PointLight(SAGE, 18, 0, 2);
  cursorLight.position.set(0, 0, 4);
  const fill = new THREE.HemisphereLight(0xf2efe9, 0x1a1208, 0.6);
  scene.add(key, back, cursorLight, fill);

  // ---- the house
  const root = new THREE.Group();
  scene.add(root);
  const partsByName = {};
  const meshes = [];

  for (const name of PARTS) {
    const outer = new THREE.Group();
    outer.name = name;
    const content = new THREE.Group();
    outer.add(content);
    const edgeMat = new THREE.LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.45 });
    const mat = makePartMaterials(name);
    const subs = [];
    for (const it of SPEC[name]) {
      const geo = boxGeometry(it.b);
      const mesh = new THREE.Mesh(geo, mat(it.m));
      mesh.userData.part = name;
      if (it.edges !== false) mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), edgeMat));
      content.add(mesh);
      meshes.push(mesh);
      if (it.sub) subs.push([mesh, new THREE.Vector3(...it.sub)]);
    }
    // outer sits on the part's anchor centre so the highlight pulse and explode act about it
    const a0 = new THREE.Vector3(...anchorCentre(name, 0));
    const a1 = new THREE.Vector3(...anchorCentre(name, 1));
    content.position.copy(a0).multiplyScalar(-1);
    outer.position.copy(a0);
    root.add(outer);
    const materials = [...new Set(content.children.map((m) => m.material))];
    partsByName[name] = {
      group: outer,
      base: a0,
      dir: new THREE.Vector3(...EXPLODE[name]),
      shift: a1.sub(a0), // anchor drift from sub offsets per unit ex (outer-local)
      subs, materials, edgeMat,
    };
  }

  // ---- state application (allocation free)
  let swayX = 0, swayY = 0, lastT = 0, highlighted = null, visible = true;
  const PULSE_RATE = 6;

  function sync() {
    const ex = THREE.MathUtils.clamp(state.ex || 0, 0, 1);
    root.position.set(state.px || 0, state.py || 0, state.pz || 0);
    root.rotation.set((state.rx || 0) + swayX, (state.ry || 0) + swayY, state.rz || 0);
    root.scale.setScalar(state.s === undefined ? 1 : state.s);
    const pulse = 0.5 + 0.5 * Math.sin(lastT * PULSE_RATE);
    for (let i = 0; i < PARTS.length; i++) {
      const name = PARTS[i];
      const p = partsByName[name];
      p.group.position.copy(p.base).addScaledVector(p.dir, ex);
      for (let j = 0; j < p.subs.length; j++) p.subs[j][0].position.copy(p.subs[j][1]).multiplyScalar(ex);
      if (name === highlighted) {
        p.group.scale.setScalar(1 + 0.02 * pulse);
        for (const m of p.materials) m.emissiveIntensity = 0.25 + 0.3 * pulse;
      }
    }
    root.updateMatrixWorld(true);
  }

  function clearHighlight(name) {
    const p = partsByName[name];
    if (!p) return;
    p.group.scale.setScalar(1);
    for (const m of p.materials) {
      m.emissive.setHex(m.userData.baseEmissive);
      m.emissiveIntensity = m.userData.baseIntensity;
    }
    p.edgeMat.color.setHex(BONE);
    p.edgeMat.opacity = 0.45;
  }

  // ---- public api
  const ndc = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();
  const ray = new THREE.Vector2();

  const api = {
    render(o = {}) {
      if (!visible) return;
      if (o.sway) { swayX = o.sway[0] || 0; swayY = o.sway[1] || 0; }
      if (typeof o.t === "number") lastT = o.t;
      if (o.light) cursorLight.position.set((o.light[0] || 0) * 3, (o.light[1] || 0) * 2.5, 4);
      sync();
      renderer.render(scene, camera);
    },

    pick(clientX, clientY) {
      if (!interactive || !visible) return null;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);
      if (nx < -1 || nx > 1 || ny < -1 || ny > 1) return null;
      sync();
      ray.set(nx, ny);
      raycaster.setFromCamera(ray, camera);
      const hit = raycaster.intersectObjects(meshes, false)[0];
      return hit ? hit.object.userData.part : null;
    },

    project(partName) {
      const p = partsByName[partName];
      if (!p) return null;
      sync();
      const ex = THREE.MathUtils.clamp(state.ex || 0, 0, 1);
      ndc.copy(p.shift).multiplyScalar(ex);
      p.group.localToWorld(ndc);
      ndc.project(camera);
      if (!(ndc.z > -1 && ndc.z < 1)) return null;
      return [(ndc.x * 0.5 + 0.5) * STAGE_W, (-ndc.y * 0.5 + 0.5) * STAGE_H];
    },

    highlight(partName) {
      const next = partsByName[partName] ? partName : null;
      if (next === highlighted) return;
      clearHighlight(highlighted);
      highlighted = next;
      if (!next) return;
      const p = partsByName[next];
      for (const m of p.materials) m.emissive.setHex(SAGE);
      p.edgeMat.color.setHex(SAGE);
      p.edgeMat.opacity = 0.95;
    },

    setVisible(v) {
      visible = !!v;
      canvas.style.opacity = visible ? "" : "0"; // keep the GPU layer alive between model scenes
    },

    setPixelRatio(n) { applyPixelRatio(n); },
  };

  // compile shaders up front so the first visible frame does not hitch
  sync();
  renderer.compile(scene, camera);
  renderer.render(scene, camera);
  return api;
}
