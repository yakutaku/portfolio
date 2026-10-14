import { createPixelCity } from './scene';

const hero = document.getElementById('hero')!;
const status = document.getElementById('status')!;
const size = document.getElementById('size') as HTMLInputElement;
const night = document.getElementById('night') as HTMLInputElement;
const pulse = document.getElementById('pulse') as HTMLInputElement;

const forceWebGL = new URLSearchParams(location.search).has('webgl');

createPixelCity(hero, { forceWebGL })
  .then((city) => {
    status.textContent = `Rendering with ${city.backend === 'webgpu' ? 'WebGPU' : 'WebGL2 (fallback)'}`;
    size.addEventListener('input', () => city.setCitySize(size.valueAsNumber / 100));
    night.addEventListener('input', () => city.setNight(night.valueAsNumber / 100));

    // Stand-in for the Web Audio analyser: a decaying kick every half second.
    let start = performance.now();
    const tick = () => {
      if (pulse.checked) {
        const beat = ((performance.now() - start) / 500) % 1;
        city.setEnergy(Math.exp(-beat * 6));
      } else {
        city.setEnergy(0);
      }
      requestAnimationFrame(tick);
    };
    pulse.addEventListener('change', () => (start = performance.now()));
    tick();
  })
  .catch((error: unknown) => {
    status.textContent = 'No WebGPU or WebGL2, showing the static image.';
    console.error(error);
  });
