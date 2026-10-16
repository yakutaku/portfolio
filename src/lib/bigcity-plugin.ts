// BigCity's editor, ported from the JUCE source to a 2D canvas.
// Every number here comes from the plugin's docs/ui-spec.md and Source/UiSpec.h, in
// window points (768 × 416); the canvas scales points to whatever size the page gives it.

const W = 768;
const H = 416;

const ink = '#3B3160';
const windowLit = '#FBE08A';
const windowLitBypassed = '#E0E0E0';
const waterHighlight = '#FFF3C4';
const pointerHighlight = '#FFFDF6';

const SCREEN = { x: 240, y: 104, w: 336, h: 280, r: 14 };
const KNOB = { x: 24, y: 136, size: 192, cx: 120, cy: 232, capRadius: 56 };
const SWITCH = { x: 608, y: 188, w: 136, h: 112, hitW: 128 };
const LCD = { x: 68, y: 332 };
const CELL = 3; // points per skyline grid pixel
const MAX_LIT_FRACTION = 0.6;
const BYPASS_FADE_MS = 200;
const GLIDE_MS = 80;
const SHIMMER_FPS = 8;

const GLINT_ROWS = [61, 64, 67, 70, 73];
const GLINT_HALF_WIDTHS = [16, 12, 8, 5, 2];
const GLINT_CENTRE_X = 57;
const WATER = { top: 59, bottom: 80, width: 112 };
const MAX_SPARKLES = 8;
const CYCLE_S = 1.5;

export interface PluginAssets {
  panel: HTMLImageElement;
  overlay: HTMLImageElement;
  knobBase: HTMLImageElement;
  knobRotor: HTMLImageElement;
  switchOn: HTMLImageElement;
  switchBypassed: HTMLImageElement;
  keyframes: HTMLImageElement[]; // City size 0, 25, 50, 75, 100
  windows: [number, number][]; // grid cells, in lighting order
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Couldn't load ${src}`));
    img.src = src;
  });

export async function loadPluginAssets(base = '/plugin'): Promise<PluginAssets> {
  const [panel, overlay, knobBase, knobRotor, switchOn, switchBypassed, ...keyframes] = await Promise.all([
    loadImage(`${base}/panel.webp`),
    loadImage(`${base}/screen_overlay.webp`),
    loadImage(`${base}/knob_base.webp`),
    loadImage(`${base}/knob_rotor.webp`),
    loadImage(`${base}/switch_fx_on.webp`),
    loadImage(`${base}/switch_bypassed.webp`),
    ...['000', '025', '050', '075', '100'].map((n) => loadImage(`${base}/skyline_tod_${n}.webp`)),
  ]);
  const windows = (await (await fetch(`${base}/skyline-windows.json`)).json()) as [number, number][];
  return { panel, overlay, knobBase, knobRotor, switchOn, switchBypassed, keyframes, windows };
}

// ---- Seven-segment readout (Source/SevenSegment.cpp) ------------------------------

const SEGMENTS: Record<number, string> = {
  0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc',
  5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg',
};
const SEG = { ht: 2.25, gap: 1, left: 2.25, right: 13.75, top: 2.25, mid: 14, bottom: 25.75, cellTop: 6, cellH: 28 };
const SKEW = Math.tan((6 * Math.PI) / 180);
const CELL_X = { half: 18, tens: 36, ones: 55, tenths: 80 };

type Pt = [number, number];
const horizontal = (y: number): Pt[] => {
  const { ht, gap, left, right } = SEG;
  return [[left + gap, y], [left + gap + ht, y - ht], [right - gap - ht, y - ht], [right - gap, y], [right - gap - ht, y + ht], [left + gap + ht, y + ht]];
};
const vertical = (x: number, top: number, bottom: number): Pt[] => {
  const { ht, gap } = SEG;
  return [[x, top + gap], [x + ht, top + gap + ht], [x + ht, bottom - gap - ht], [x, bottom - gap], [x - ht, bottom - gap - ht], [x - ht, top + gap + ht]];
};
const OUTLINES: Record<string, Pt[]> = {
  a: horizontal(SEG.top), g: horizontal(SEG.mid), d: horizontal(SEG.bottom),
  b: vertical(SEG.right, SEG.top, SEG.mid), c: vertical(SEG.right, SEG.mid, SEG.bottom),
  f: vertical(SEG.left, SEG.top, SEG.mid), e: vertical(SEG.left, SEG.mid, SEG.bottom),
};

function readoutPath(value: number): Path2D {
  const path = new Path2D();
  const tenths = Math.round(Math.min(100, Math.max(0, value)) * 10);
  const addDigit = (digit: number | null, cellX: number) => {
    if (digit === null) return;
    for (const s of SEGMENTS[digit]) {
      OUTLINES[s].forEach(([x, y], i) => {
        // Italic skew pivots on the cell's bottom edge.
        const px = LCD.x + cellX + x + (SEG.cellH - y) * SKEW;
        const py = LCD.y + SEG.cellTop + y;
        if (i === 0) path.moveTo(px, py);
        else path.lineTo(px, py);
      });
      path.closePath();
    }
  };
  if (tenths >= 1000) addDigit(1, CELL_X.half);
  addDigit(tenths >= 100 ? Math.floor(tenths / 100) % 10 : null, CELL_X.tens);
  addDigit(Math.floor(tenths / 10) % 10, CELL_X.ones);
  addDigit(tenths % 10, CELL_X.tenths);
  path.rect(LCD.x + 74.5, LCD.y + 30, 4, 4);
  return path;
}

// ---- Water shimmer (Source/WaterShimmer.cpp) ---------------------------------------

function hash(v: number): number {
  v >>>= 0;
  v ^= v >>> 16;
  v = Math.imul(v, 0x7feb352d) >>> 0;
  v ^= v >>> 15;
  v = Math.imul(v, 0x846ca68b) >>> 0;
  v ^= v >>> 16;
  return v >>> 0;
}
const lround = (x: number) => Math.sign(x) * Math.round(Math.abs(x)); // C++ rounds halves away from zero

// ---- Easing ------------------------------------------------------------------------

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (2 - 2 * t) ** 3 / 2);

// ---- The editor ----------------------------------------------------------------------

export interface PluginEditorOptions {
  reducedMotion: boolean;
  onValue?: (value: number) => void;
  onBypass?: (bypassed: boolean) => void;
}

export class PluginEditor {
  readonly canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private greyKeyframes: HTMLCanvasElement[];
  private glowCache = new Map<number, HTMLCanvasElement>();
  private scale = 1;

  value = 50; // the parameter
  private shown = 50; // what the knob and skyline show (only glides ease)
  private glide: { from: number; to: number; start: number } | null = null;
  bypassed = false;
  private bypassShare = 0; // 0 = normal look, 1 = bypassed look
  private fade: { from: number; to: number; start: number } | null = null;
  hover: 'knob' | 'switch' | null = null;
  press: 'knob' | 'switch' | null = null;

  private frame = 0;
  private lastShimmer = 0;
  private visible = true;
  private dirty = true;
  private startTime = performance.now();

  constructor(private assets: PluginAssets, private options: PluginEditorOptions) {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-hidden', 'true');
    this.ctx = this.canvas.getContext('2d')!;
    this.greyKeyframes = assets.keyframes.map(toGreyscale);
  }

  /** Size the canvas to `cssWidth`; the backing store matches the screen's pixel density. */
  resize(cssWidth: number) {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.scale = (cssWidth / W) * dpr;
    this.canvas.width = Math.round(W * this.scale);
    this.canvas.height = Math.round(H * this.scale);
    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${(cssWidth * H) / W}px`;
    this.glowCache.clear();
    this.dirty = true;
    this.draw(performance.now());
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (visible) this.loop();
  }

  /** Drags follow 1:1; keys, wheel notches and resets glide over 80 ms. */
  setValue(value: number, glide = false) {
    const v = Math.min(100, Math.max(0, Math.round(value * 10) / 10));
    if (v === this.value && !glide) return;
    this.value = v;
    if (glide && !this.options.reducedMotion) {
      this.glide = { from: this.shown, to: v, start: performance.now() };
    } else {
      this.glide = null;
      this.shown = v;
    }
    this.options.onValue?.(v);
    this.invalidate();
  }

  setBypassed(bypassed: boolean) {
    if (bypassed === this.bypassed) return;
    this.bypassed = bypassed;
    // Toggling mid-fade turns back from where it is.
    this.fade = { from: this.bypassShare, to: bypassed ? 1 : 0, start: performance.now() };
    this.options.onBypass?.(bypassed);
    this.invalidate();
  }

  invalidate() {
    this.dirty = true;
    this.loop();
  }

  /** Which control a point (in CSS px relative to the canvas) is over. */
  hitTest(cssX: number, cssY: number): 'knob' | 'switch' | null {
    const k = this.canvas.clientWidth / W;
    const x = cssX / k;
    const y = cssY / k;
    if (Math.hypot(x - KNOB.cx, y - KNOB.cy) <= KNOB.capRadius) return 'knob';
    if (x >= SWITCH.x && x < SWITCH.x + SWITCH.hitW && y >= SWITCH.y && y < SWITCH.y + SWITCH.h) return 'switch';
    return null;
  }

  private loop = () => {
    if (this.frame) return;
    this.frame = requestAnimationFrame((now) => {
      this.frame = 0;
      const animating = this.step(now);
      if (this.dirty || animating) this.draw(now);
      if (this.visible && (animating || this.shimmering())) this.loop();
    });
  };

  /** Advances glides and fades; returns true while one is still running. */
  private step(now: number): boolean {
    let running = false;
    if (this.glide) {
      // rAF timestamps can be slightly earlier than the moment a glide began, so clamp both ends.
      const t = Math.min(1, Math.max(0, (now - this.glide.start) / GLIDE_MS));
      this.shown = this.glide.from + (this.glide.to - this.glide.from) * easeOutCubic(t);
      if (t >= 1) this.glide = null;
      else running = true;
      this.dirty = true;
    }
    if (this.fade) {
      const t = Math.min(1, Math.max(0, (now - this.fade.start) / BYPASS_FADE_MS));
      this.bypassShare = this.fade.from + (this.fade.to - this.fade.from) * easeInOutCubic(t);
      if (t >= 1) this.fade = null;
      else running = true;
      this.dirty = true;
    }
    if (this.shimmering() && now - this.lastShimmer >= 1000 / SHIMMER_FPS) {
      this.lastShimmer = now;
      this.dirty = true;
    }
    return running;
  }

  private shimmering() {
    return this.visible && !this.options.reducedMotion && !this.bypassed && this.shown > 0 && document.visibilityState === 'visible';
  }

  private draw(now: number) {
    this.dirty = false;
    const { ctx, assets } = this;
    ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // 1. Panel (wordmark, katakana, screws, LCD with burned-in 188.8, bezel are all baked in).
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(assets.panel, 0, 0, W, H);

    // 2. Screen: bypassed look first, then the opaque normal look over it at 1 − share.
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h, SCREEN.r);
    ctx.clip();
    ctx.translate(SCREEN.x, SCREEN.y);
    if (this.bypassShare > 0) {
      ctx.globalAlpha = 0.3;
      this.drawSkyline(this.greyKeyframes, windowLitBypassed, false, now);
    }
    if (this.bypassShare < 1) {
      ctx.globalAlpha = 1 - this.bypassShare;
      this.drawSkyline(assets.keyframes, windowLit, true, now);
    }
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(assets.overlay, 0, 0, SCREEN.w, SCREEN.h); // 3. Glass
    ctx.restore();

    // 4–6. Knob: fixed base, rotating rotor and pointer, hover/press overlay.
    const angle = ((-135 + 2.7 * this.shown) * Math.PI) / 180;
    ctx.drawImage(assets.knobBase, KNOB.x, KNOB.y, KNOB.size, KNOB.size);
    ctx.save();
    ctx.translate(KNOB.cx, KNOB.cy);
    ctx.rotate(angle);
    ctx.drawImage(assets.knobRotor, -KNOB.size / 2, -KNOB.size / 2, KNOB.size, KNOB.size);
    this.drawPointer();
    ctx.restore();
    if (this.hover === 'knob' || this.press === 'knob') {
      ctx.beginPath();
      ctx.ellipse(KNOB.cx, KNOB.cy, KNOB.capRadius, KNOB.capRadius, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.press === 'knob' ? 'rgb(59 49 96 / 0.08)' : 'rgb(255 255 255 / 0.1)';
      ctx.fill();
    }

    // 7. Readout: the parameter itself, never eased.
    ctx.fillStyle = ink;
    ctx.fill(readoutPath(this.value));

    // 8–9. Bypass switch and its overlay.
    ctx.drawImage(this.bypassed ? assets.switchBypassed : assets.switchOn, SWITCH.x, SWITCH.y, SWITCH.w, SWITCH.h);
    if (this.hover === 'switch' || this.press === 'switch') {
      ctx.beginPath();
      ctx.roundRect(SWITCH.x, SWITCH.y, 48, 112, 24);
      ctx.fillStyle = this.press === 'switch' ? 'rgb(59 49 96 / 0.08)' : 'rgb(255 255 255 / 0.1)';
      ctx.fill();
    }
  }

  /** Keyframe crossfade, lit windows and (in the normal look) glow and water shimmer, in screen-local points. */
  private drawSkyline(keyframes: CanvasImageSource[], litColour: string, normal: boolean, now: number) {
    const { ctx } = this;
    const s = this.shown;
    const layerAlpha = ctx.globalAlpha;
    // Nearest neighbour when enlarging the pixel art; smooth only when shrinking it on small screens.
    ctx.imageSmoothingEnabled = this.scale < 2;

    const lower = Math.min(3, Math.floor(s / 25));
    const t = s >= 100 ? 1 : (s - lower * 25) / 25;
    ctx.drawImage(keyframes[s >= 100 ? 4 : lower], 0, 0, SCREEN.w, SCREEN.h);
    if (s < 100 && t > 0) {
      ctx.globalAlpha = layerAlpha * t;
      ctx.drawImage(keyframes[lower + 1], 0, 0, SCREEN.w, SCREEN.h);
      ctx.globalAlpha = layerAlpha;
    }

    const lit = Math.floor(this.assets.windows.length * MAX_LIT_FRACTION * (s / 100));
    ctx.fillStyle = litColour;
    for (let i = 0; i < lit; i++) {
      const [x, y] = this.assets.windows[i];
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }
    if (!normal) return;

    if (lit > 0) {
      ctx.globalAlpha = layerAlpha * 0.8;
      ctx.drawImage(this.glow(lit), 0, 0, SCREEN.w, SCREEN.h);
      ctx.globalAlpha = layerAlpha;
    }
    this.drawWater(now, layerAlpha);
  }

  /** Lit windows blurred by 3 pt, cached per lit count. */
  private glow(lit: number): HTMLCanvasElement {
    let layer = this.glowCache.get(lit);
    if (layer) return layer;
    layer = document.createElement('canvas');
    layer.width = Math.ceil(SCREEN.w * this.scale);
    layer.height = Math.ceil(SCREEN.h * this.scale);
    const g = layer.getContext('2d')!;
    g.scale(this.scale, this.scale);
    g.shadowColor = windowLit;
    g.shadowBlur = 3 * 2 * this.scale; // canvas shadowBlur is in device pixels, about twice the radius
    g.fillStyle = windowLit;
    for (let i = 0; i < lit; i++) {
      const [x, y] = this.assets.windows[i];
      g.fillRect(x * CELL, y * CELL, CELL, CELL);
    }
    this.glowCache.set(lit, layer);
    return layer;
  }

  private drawWater(now: number, layerAlpha: number) {
    const share = this.shown / 100;
    if (share <= 0) return;
    const { ctx } = this;
    const still = this.options.reducedMotion;
    const seconds = still ? 0 : Math.floor(((now - this.startTime) / 1000) * SHIMMER_FPS) / SHIMMER_FPS;
    ctx.fillStyle = waterHighlight;

    // Glints on the sun's reflection, each row drifting ±1 grid pixel out of phase.
    ctx.globalAlpha = layerAlpha * 0.6 * share;
    GLINT_ROWS.forEach((row, i) => {
      const offset = lround(Math.sin((2 * Math.PI * seconds) / CYCLE_S + (2 * Math.PI * i) / GLINT_ROWS.length));
      const hw = GLINT_HALF_WIDTHS[i];
      ctx.fillRect((GLINT_CENTRE_X - hw + offset) * CELL, row * CELL, 2 * hw * CELL, CELL);
    });

    // Sparkles: each fades in and out over 1.5 s at its own phase, then moves.
    if (!still) {
      const count = lround(MAX_SPARKLES * share);
      const height = WATER.bottom - WATER.top + 1;
      for (let i = 0; i < count; i++) {
        const position = seconds / CYCLE_S + hash(i) / 4294967296;
        const cycle = Math.floor(position);
        const within = position - cycle;
        const spot = hash((Math.imul(cycle, MAX_SPARKLES) + i + 1) >>> 0);
        const x = spot % WATER.width;
        const y = WATER.top + (Math.floor(spot / WATER.width) % height);
        ctx.globalAlpha = layerAlpha * 0.6 * (1 - Math.abs(2 * within - 1));
        ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
      }
    }
    ctx.globalAlpha = layerAlpha;
  }

  /** Pointer: a 4 × 20 rounded rect 30–50 pt above centre, with a 1 pt highlight on its outer end, at 92%. */
  private drawPointer() {
    const { ctx } = this;
    const pointer = new Path2D();
    pointer.roundRect(-2, -50, 4, 20, 2);
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = ink;
    ctx.fill(pointer);
    ctx.clip(pointer);
    ctx.globalAlpha = 0.92 * 0.25;
    ctx.fillStyle = pointerHighlight;
    ctx.fillRect(-2, -50, 4, 1);
    ctx.restore();
  }
}

/** Luminosity greyscale (0.3 R + 0.59 G + 0.11 B), computed once at load as in the plugin. */
function toGreyscale(img: HTMLImageElement): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  g.drawImage(img, 0, 0);
  const data = g.getImageData(0, 0, c.width, c.height);
  const p = data.data;
  for (let i = 0; i < p.length; i += 4) {
    const l = 0.3 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2];
    p[i] = p[i + 1] = p[i + 2] = l;
  }
  g.putImageData(data, 0, 0);
  return c;
}
