// Real-time pixel city: WebGPU with automatic WebGL2 fallback (three.js WebGPURenderer + TSL).
// The city is drawn once on the CPU; the shader regrades it for time of day and
// renders the water (reflection shimmer, sun glint, pointer ripples) every frame.

import * as THREE from 'three/webgpu';
import {
  Fn,
  If,
  abs,
  clamp,
  exp,
  float,
  floor,
  hash,
  int,
  ivec2,
  length,
  min,
  mix,
  mod,
  round,
  select,
  sin,
  smoothstep,
  step,
  texture,
  uniform,
  uniformArray,
  uv,
  vec2,
  vec3,
  vec4,
} from 'three/tsl';
import { CLASS_STEP, Cls, GRID_HEIGHT, HORIZON, SKY_HEX, SKY_STOPS, drawCity, layoutFor, type CityLayout } from './city';

const MAX_GRID_WIDTH = 1024;
const RIPPLE_COUNT = 6;
const WATER_ROWS = GRID_HEIGHT - HORIZON;

export interface PixelCityOptions {
  /** 0–1, BigCity's City size. Default 0.5. */
  citySize?: number;
  /** 0 = sunset, 1 = night. Default 0. */
  night?: number;
  /** Desired canvas height in CSS px; the real height snaps to whole pixels. */
  targetHeight?: () => number;
  forceWebGL?: boolean;
  reducedMotion?: boolean;
}

export interface PixelCity {
  readonly backend: 'webgpu' | 'webgl2';
  setCitySize(value: number): void;
  setNight(value: number): void;
  /** 0–1 audio energy, smoothed internally; gently brightens lit windows and stirs the water. */
  setEnergy(value: number): void;
  dispose(): void;
}

// Hex colours are authored in sRGB; THREE.Color converts them to linear for the shader.
const col = (hex: string) => {
  const c = new THREE.Color(hex);
  return vec3(c.r, c.g, c.b);
};

/**
 * Starts the scene on WebGPU and falls back to WebGL2 if WebGPU is missing
 * or fails on its first frame (some browsers expose WebGPU with gaps).
 * Rejects only if neither works; show the static poster image in that case.
 */
export async function createPixelCity(container: HTMLElement, options: PixelCityOptions = {}): Promise<PixelCity> {
  if (!options.forceWebGL && 'gpu' in navigator) {
    try {
      return await start(container, options, false);
    } catch (error) {
      console.warn('Pixel city: WebGPU failed, falling back to WebGL2.', error);
    }
  }
  return start(container, options, true);
}

async function start(container: HTMLElement, options: PixelCityOptions, forceWebGL: boolean): Promise<PixelCity> {
  const reducedMotion =
    options.reducedMotion ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targetHeight = options.targetHeight ?? (() => Math.min(600, Math.max(280, window.innerWidth * 0.4)));

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.display = 'block';
  canvas.style.touchAction = 'pan-y';

  const renderer = new THREE.WebGPURenderer({ canvas, antialias: false, forceWebGL });
  await renderer.init();
  const backend = (renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend ? 'webgpu' : 'webgl2';
  renderer.setPixelRatio(1);
  container.appendChild(canvas);

  // City texture: allocated once at max width; narrower screens use the left part.
  const pixels = new Uint8Array(MAX_GRID_WIDTH * HORIZON * 4);
  const cityTexture = new THREE.DataTexture(pixels, MAX_GRID_WIDTH, HORIZON, THREE.RGBAFormat, THREE.UnsignedByteType);
  cityTexture.colorSpace = THREE.SRGBColorSpace;
  cityTexture.magFilter = THREE.NearestFilter;
  cityTexture.minFilter = THREE.NearestFilter;
  cityTexture.generateMipmaps = false;
  const city = texture(cityTexture);

  const uTime = uniform(0);
  const uNight = uniform(options.night ?? 0);
  const uEnergy = uniform(0);
  const uGridW = uniform(360);
  const uSunX = uniform(230);
  const uSunR = uniform(34);
  const rippleData = Array.from({ length: RIPPLE_COUNT }, () => new THREE.Vector4(0, 0, -100, 0));
  const uRipples = uniformArray(rippleData, 'vec4');

  // Turns one city texel into its final colour for the current time of day.
  const grade = Fn(([texel, gx, gy]: [any, any, any]) => {
    const night = uNight;
    const base = texel.rgb;
    const cls = round(texel.a.mul(255 / CLASS_STEP));

    // Night arrives in 8 steps, each spread across a 4×4 ordered-dither pattern,
    // so dusk sweeps across the skyline pixel by pixel instead of jumping.
    const bayer2 = (x: any, y: any) => {
      const a = mod(x, 2);
      const b = mod(y, 2);
      return a.add(b).sub(a.mul(b).mul(2)).mul(2).add(b); // [[0,2],[3,1]]
    };
    const bayer = bayer2(gx, gy).mul(4).add(bayer2(floor(gx.div(2)), floor(gy.div(2)))).div(16);
    const nq = floor(clamp(night.mul(8).add(bayer), 0, 8)).div(8);

    const skyNight = mix(col('#26244F'), col('#5B4F91'), gy.div(HORIZON));
    const star = step(0.996, hash(gx.add(gy.mul(1013)))).mul(step(gy, HORIZON * 0.6)).mul(night);
    const sky = mix(base, skyNight, nq).add(col('#FFF6D5').mul(star));

    const sunRow = float(HORIZON).sub(uSunR).add(night.mul(uSunR.add(6)));
    // The sky behind the sun, so the sun can set without leaving a ghost disc.
    let sunsetSky: any = col(SKY_HEX[0]);
    for (let i = 1; i < SKY_HEX.length; i++) {
      sunsetSky = select(gy.greaterThanEqual(Math.round(SKY_STOPS[i] * HORIZON)), col(SKY_HEX[i]), sunsetSky);
    }
    const sunSky = mix(sunsetSky, skyNight, nq);
    const sun = select(gy.greaterThanEqual(sunRow), mix(base, base.mul(vec3(1, 0.75, 0.7)), night), sunSky);

    const back = mix(base, col('#4E4788'), nq);
    const tower = mix(base, base.mul(vec3(0.62, 0.5, 0.62)), nq.mul(0.8));
    const front = mix(base, base.mul(vec3(0.52, 0.48, 0.66)), nq);
    const pink = mix(base, base.mul(vec3(0.5, 0.42, 0.6)), nq);
    const horizon = mix(base, col('#6F64AA'), nq);

    // Audio only nudges lit windows a little brighter; it never switches windows on or off.
    const glow = col('#FFE48C').mul(uEnergy.mul(0.12).add(1));
    const windowLit = mix(base.mul(uEnergy.mul(0.08).add(1)), glow, nq);
    const dark = mix(col('#564D97'), col('#2F2A5E'), nq);
    const on = step(texel.r, night.mul(1.1).sub(0.12));
    const windowDusk = mix(dark, glow, on);

    return select(cls.equal(Cls.Sky), sky,
      select(cls.equal(Cls.Sun), sun,
      select(cls.equal(Cls.Back), back,
      select(cls.equal(Cls.Tower), tower,
      select(cls.equal(Cls.Front), front,
      select(cls.equal(Cls.WindowLit), windowLit,
      select(cls.equal(Cls.WindowDusk), windowDusk,
      select(cls.equal(Cls.Pink), pink, horizon))))))));
  });

  const colorNode = Fn(() => {
    const p = uv();
    const gx = floor(p.x.mul(uGridW));
    const gy = floor(float(1).sub(p.y).mul(GRID_HEIGHT));
    const out = vec3(0).toVar();

    If(gy.lessThan(HORIZON), () => {
      out.assign(grade(city.load(ivec2(int(gx), int(gy))), gx, gy));
    }).Else(() => {
      const k = gy.sub(HORIZON);
      const depth = k.div(WATER_ROWS);

      // Pointer ripples: expanding rings, squashed vertically for perspective.
      const rip = float(0).toVar();
      for (let i = 0; i < RIPPLE_COUNT; i++) {
        // TSL's typings don't know this array holds vec4s.
        const r = uRipples.element(i) as any;
        const age = uTime.sub(r.z);
        const d = length(vec2(gx.sub(r.x), gy.sub(r.y).mul(2.2)));
        const front = age.mul(18);
        const ahead = float(1).sub(smoothstep(front.sub(2), front.add(6), d));
        const wave = sin(d.mul(0.8).sub(age.mul(7))).mul(exp(age.mul(-1.1))).mul(ahead).mul(step(0, age));
        rip.addAssign(wave.mul(r.w));
      }

      const sway = sin(gy.mul(1.7).add(uTime.mul(2.2))).mul(depth.mul(1.8).add(1.2)).mul(uEnergy.mul(0.5).add(1));
      const dx = round(sway.add(rip.mul(3)));
      const srcX = clamp(gx.add(dx), 0, uGridW.sub(1));
      const srcY = clamp(float(HORIZON - 2).sub(floor(k.mul(1.25).add(rip.mul(1.5)))), 0, HORIZON - 1);
      const reflected = grade(city.load(ivec2(int(srcX), int(srcY))), srcX, srcY) as any;

      const water = mix(col('#8D86CC'), col('#2B285C'), uNight);
      const band = step(mod(gy.add(floor(uTime.mul(4))), 3), 0.5);
      const tint = min(depth.mul(0.45).add(0.3).add(band.mul(0.18)), 0.85);
      const tinted = mix(reflected, water, tint);

      // Ripple crests catch the light and troughs fall into shade, so rings show
      // even where the reflection is flat sky (displacement alone is invisible there).
      const crest = step(0.4, rip);
      const trough = step(0.4, rip.negate());
      const highlight = mix(col('#DCD5F7'), col('#8A82C6'), uNight);
      const surface = mix(mix(tinted, highlight, crest.mul(0.6)), water.mul(0.72), trough.mul(0.4));

      // Sun glint: a sparkling column that narrows towards the viewer and fades at night.
      const halfWidth = uSunR.mul(0.9).sub(k.mul(0.55));
      const wobble = round(sin(gy.mul(2.3).add(uTime.mul(1.5))).mul(3));
      const inGlint = step(abs(gx.sub(uSunX).sub(wobble)), halfWidth).mul(step(0.5, mod(gy, 3)));
      const sparkle = step(0.35, hash(gx.add(gy.mul(733)).add(floor(uTime.mul(8)).mul(7919))));
      const glint = inGlint.mul(sparkle).mul(float(1).sub(uNight));
      const glintColour = mix(col('#F8D27E'), water, depth.mul(0.5).add(0.15));

      out.assign(mix(surface, glintColour, glint));
    });

    return vec4(out, 1);
  })();

  const material = new THREE.MeshBasicNodeMaterial();
  material.colorNode = colorNode;
  const geometry = new THREE.PlaneGeometry(2, 2);
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(geometry, material));
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // --- State -------------------------------------------------------------
  let layout: CityLayout = layoutFor(360);
  let citySize = options.citySize ?? 0.5;
  let gridW = 0;
  let scale = 1;
  let lastCssWidth = -1;
  let running = false;
  let visible = true;
  let lastFrame = 0;
  let nextRipple = 0;
  let lastRippleAt = { x: -99, y: -99, t: 0 };
  let disposed = false;
  let energyTarget = 0;

  const redraw = () => {
    drawCity(pixels, MAX_GRID_WIDTH, layout, citySize);
    cityTexture.needsUpdate = true;
  };

  const render = () => {
    try {
      renderer.render(scene, camera);
    } catch (error) {
      renderer.setAnimationLoop(null); // stop rather than throw every frame
      running = false;
      throw error;
    }
  };

  const resize = () => {
    const cssWidth = container.clientWidth;
    if (cssWidth === lastCssWidth || cssWidth === 0) return;
    lastCssWidth = cssWidth;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const deviceWidth = Math.round(cssWidth * dpr);
    // Whole-number scale so every city pixel is the same size on screen.
    scale = Math.max(1, Math.floor((targetHeight() * dpr) / GRID_HEIGHT), Math.ceil(deviceWidth / MAX_GRID_WIDTH));
    const newGridW = Math.ceil(deviceWidth / scale);
    renderer.setSize(newGridW * scale, GRID_HEIGHT * scale, false);
    canvas.style.width = `${(newGridW * scale) / dpr}px`;
    canvas.style.height = `${(GRID_HEIGHT * scale) / dpr}px`;
    container.style.height = canvas.style.height;
    if (newGridW !== gridW) {
      gridW = newGridW;
      layout = layoutFor(gridW);
      uGridW.value = gridW;
      uSunX.value = layout.sunX;
      uSunR.value = layout.sunRadius;
      redraw();
    }
    if (!running) render();
  };

  // --- Ripples -----------------------------------------------------------
  const addRipple = (clientX: number, clientY: number, strength: number) => {
    if (reducedMotion) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * gridW;
    const y = ((clientY - rect.top) / rect.height) * GRID_HEIGHT;
    if (y < 0 || y > GRID_HEIGHT) return;
    const waterY = Math.max(y, HORIZON + 4); // taps on the city ripple the water just below it
    const now = uTime.value;
    const moved = Math.hypot(x - lastRippleAt.x, waterY - lastRippleAt.y);
    if (strength < 1 && (now - lastRippleAt.t < 0.09 || moved < 3)) return;
    lastRippleAt = { x, y: waterY, t: now };
    rippleData[nextRipple].set(x, waterY, now, strength);
    nextRipple = (nextRipple + 1) % RIPPLE_COUNT;
  };
  const onPointerMove = (e: PointerEvent) => addRipple(e.clientX, e.clientY, 0.45);
  const onPointerDown = (e: PointerEvent) => addRipple(e.clientX, e.clientY, 1.6);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', onPointerDown);

  // --- Loop: runs only while on screen, the tab is visible and motion is allowed --
  const frame = (ms: number) => {
    const dt = lastFrame ? Math.min((ms - lastFrame) / 1000, 0.1) : 0;
    lastFrame = ms;
    uTime.value += dt;
    // Smooth the audio input: quick attack, slow release, so beats swell instead of flash.
    const tau = energyTarget > uEnergy.value ? 0.06 : 0.45;
    uEnergy.value += (energyTarget - uEnergy.value) * (1 - Math.exp(-dt / tau));
    render();
  };
  const updateRunning = () => {
    const shouldRun = !reducedMotion && visible && document.visibilityState === 'visible';
    if (shouldRun === running) return;
    running = shouldRun;
    lastFrame = 0;
    renderer.setAnimationLoop(running ? frame : null);
  };

  // The first frame doubles as a capability check: if it throws, clean up and let the caller fall back.
  try {
    resize();
  } catch (error) {
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerdown', onPointerDown);
    geometry.dispose();
    material.dispose();
    cityTexture.dispose();
    renderer.dispose();
    canvas.remove();
    container.style.height = '';
    throw error;
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updateRunning();
  });
  intersectionObserver.observe(container);
  document.addEventListener('visibilitychange', updateRunning);
  updateRunning();

  return {
    backend,
    setCitySize(value) {
      citySize = Math.min(1, Math.max(0, value));
      redraw();
      if (!running) render();
    },
    setNight(value) {
      uNight.value = Math.min(1, Math.max(0, value));
      if (!running) render();
    },
    setEnergy(value) {
      energyTarget = reducedMotion ? 0 : Math.min(1, Math.max(0, value));
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', updateRunning);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      geometry.dispose();
      material.dispose();
      cityTexture.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
