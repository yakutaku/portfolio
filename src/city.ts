// Procedural BigCity-style skyline, drawn at low resolution on the CPU.
// Each texel stores an sRGB colour plus a material class in alpha,
// so the shader can regrade the scene (sunset → night) without redrawing it.

export const GRID_HEIGHT = 140; // total rows, sky + water
export const HORIZON = 92; // rows of sky/city; water fills the rest

export const Cls = {
  Sky: 0,
  Sun: 1,
  Back: 2,
  Tower: 3,
  Front: 4,
  WindowLit: 5,
  WindowDusk: 6, // lights up at night; R channel stores its threshold
  Pink: 7,
  Horizon: 8,
} as const;
type Cls = (typeof Cls)[keyof typeof Cls];
export const CLASS_STEP = 20; // alpha = class * CLASS_STEP

export interface CityLayout {
  width: number;
  sunX: number;
  sunRadius: number;
  towerX: number;
}

type RGB = readonly [number, number, number];

const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

export const SKY_HEX = ['#A69BD9', '#BFA1D8', '#DDA5C8', '#EFAFA6', '#F6C39C'];
export const SKY_STOPS = [0, 0.28, 0.5, 0.7, 0.87]; // band starts, as a fraction of HORIZON

const C = {
  sky: SKY_HEX.map(hex),
  sunOuter: hex('#F5BD5F'),
  sunInner: hex('#FADB92'),
  sunStripe: hex('#EE9E88'),
  back: hex('#B6A4DA'),
  spire: hex('#B3A2DA'),
  pink: [hex('#D892B4'), hex('#C982A6'), hex('#E4A7C0')],
  towerA: hex('#EE9E88'),
  towerB: hex('#FCEFE2'),
  front: hex('#6E64B0'),
  frontEdge: hex('#5A5199'),
  lit: hex('#F6DE7A'),
  dark: hex('#564D97'),
  horizon: hex('#CFC4EA'),
};

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

// Small, fast, seedable PRNG so the city is identical on every visit.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function layoutFor(width: number): CityLayout {
  return {
    width,
    sunX: Math.round(width * 0.64),
    sunRadius: Math.min(34, Math.round(width * 0.16)),
    towerX: Math.round(width * 0.27),
  };
}

/**
 * Draws the skyline into `out` (RGBA, row 0 = top, stride = `stride` texels).
 * `citySize` is 0–1, matching BigCity's City size knob.
 */
export function drawCity(
  out: Uint8Array,
  stride: number,
  layout: CityLayout,
  citySize: number,
  seed = 7,
): void {
  const { width: W, sunX, sunRadius: SR, towerX } = layout;
  const H = HORIZON;
  const s = Math.min(1, Math.max(0, citySize));

  const put = (x: number, y: number, c: RGB, cls: Cls) => {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const i = (y * stride + x) * 4;
    out[i] = c[0];
    out[i + 1] = c[1];
    out[i + 2] = c[2];
    out[i + 3] = cls * CLASS_STEP;
  };
  const rect = (x: number, y: number, w: number, h: number, c: RGB, cls: Cls) => {
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) put(xx, yy, c, cls);
  };

  // Sky: banded gradient with ordered dithering at each band edge.
  const stops = SKY_STOPS.map((f) => Math.round(f * H));
  for (let y = 0; y < H; y++) {
    let band = 0;
    while (band + 1 < stops.length && y >= stops[band + 1]) band++;
    for (let x = 0; x < W; x++) {
      let c = C.sky[band];
      const next = stops[band + 1];
      if (next !== undefined && next - y <= 6) {
        const t = (6 - (next - y)) / 7;
        if (BAYER[y % 4][x % 4] / 16 < t) c = C.sky[band + 1];
      }
      put(x, y, c, Cls.Sky);
    }
  }

  // Sun: half disc on the horizon with sunset stripes.
  for (let y = H - SR; y < H; y++) {
    for (let x = sunX - SR; x <= sunX + SR; x++) {
      const d = Math.hypot(x - sunX, (y - H) * 1.05);
      if (d > SR) continue;
      const fromBottom = H - y;
      const stripe = fromBottom === 3 || fromBottom === 4 || fromBottom === 7 || fromBottom === 8 || fromBottom === 13 || fromBottom === 14;
      put(x, y, stripe ? C.sunStripe : d > SR - 6 ? C.sunOuter : C.sunInner, Cls.Sun);
    }
  }

  const rand = mulberry32(seed);
  const heightScale = 0.45 + 0.9 * s;
  const keep = 0.55 + 0.45 * s; // fewer buildings in a small city

  // Back layer: pale silhouettes.
  for (let x = 0; x < W; ) {
    const w = 14 + Math.floor(rand() * 16);
    const h = Math.round((12 + rand() * 26) * heightScale);
    if (rand() < keep * 0.8) rect(x, H - h, w, h, C.back, Cls.Back);
    x += w + Math.floor(rand() * 10);
  }

  // Thin spire on the left, behind everything in front.
  const spireX = Math.round(W * 0.11);
  const spireTop = Math.round(6 + (1 - s) * 30);
  rect(spireX, spireTop, 2, H - spireTop, C.spire, Cls.Back);
  rect(spireX - 2, spireTop + 24, 6, 3, C.spire, Cls.Back);
  rect(spireX - 1, spireTop + 12, 4, 2, C.spire, Cls.Back);

  // Pink mid-rise buildings around the sun.
  rect(sunX - 36, H - 16, 10, 16, C.pink[0], Cls.Pink);
  rect(sunX - 26, H - 22, 3, 22, C.pink[1], Cls.Pink);
  rect(sunX + 20, H - 14, 12, 14, C.pink[2], Cls.Pink);
  rect(sunX + 14, H - 28, 2, 28, C.pink[1], Cls.Pink);

  // Striped tower, tapering towards the top.
  const towerTop = Math.round(20 + (1 - s) * 16);
  rect(towerX, towerTop - 18, 1, 18, C.towerA, Cls.Tower);
  rect(towerX, towerTop - 12, 1, 3, C.towerB, Cls.Tower);
  for (let y = towerTop; y < H; y++) {
    const w = 3 + Math.floor((y - towerTop) * 0.26);
    rect(towerX - (w >> 1), y, w, 1, ((y - towerTop) / 5) % 2 < 1 ? C.towerA : C.towerB, Cls.Tower);
  }
  const deck = (y: number, w: number) => rect(towerX - (w >> 1), y, w, 3, C.towerB, Cls.Tower);
  deck(towerTop + 18, 15);
  deck(towerTop + 38, 23);

  // Front layer: purple blocks with 2×2 windows.
  for (let x = 0; x < W; ) {
    const w = 10 + Math.floor(rand() * 14);
    const centre = x + w / 2;
    const r = rand();
    let h: number;
    if (x < towerX + 13 && x + w > towerX - 13) {
      x += w; // keep the tower's base clear
      continue;
    } else if (Math.abs(centre - sunX) < SR * 0.8) {
      h = 6 + Math.floor(r * 8); // stay low so the sun shows
    } else if (centre > sunX + SR * 0.6) {
      h = Math.round((30 + r * 38) * heightScale); // the tall right-hand cluster
    } else if (centre < towerX) {
      h = Math.round((20 + r * 20) * heightScale);
    } else {
      h = Math.round((12 + r * 18) * heightScale);
    }
    h = Math.min(h, H - 8);
    if (rand() < keep) {
      const top = H - h;
      rect(x, top, w, h, C.front, Cls.Front);
      rect(x + w - 1, top, 1, h, C.frontEdge, Cls.Front);
      for (let wy = top + 3; wy < H - 2; wy += 4) {
        for (let wx = x + 2; wx < x + w - 2; wx += 4) {
          if (rand() < 0.5) {
            rect(wx, wy, 2, 2, C.lit, Cls.WindowLit);
          } else {
            const threshold = Math.round(rand() * 255);
            rect(wx, wy, 2, 2, [threshold, 0, 0], Cls.WindowDusk);
          }
        }
      }
    }
    x += w;
  }

  for (let x = 0; x < W; x++) put(x, H - 1, C.horizon, Cls.Horizon);
}
