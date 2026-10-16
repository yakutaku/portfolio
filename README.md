# Portfolio

Astro site with a real-time pixel city (three.js, WebGPU with WebGL2 fallback).

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # type check + production build
```

## Where things live

| To change | Edit |
| --- | --- |
| Name, title, email, links, home and about copy | `src/site.ts` |
| Case studies (copy and facts) | `src/content/work/*.md` |
| Case study images | `public/work/<slug>/`, referenced from the Markdown |
| BigCity demo audio | `public/audio/`, listed in `bigcityDemo.audio` in `src/site.ts` |
| BigCity demo art (from the plugin's `assets/`) | `public/plugin/`; drawing code ported from `Source/` in `src/lib/bigcity-plugin.ts` |
| Colours, type, spacing | `src/styles/global.css` |
| The city itself | `src/lib/pixel-city/` |

Images in Markdown: `![Alt text](/work/atspoke/onboarding.png)`.
The BigCity demo appears wherever `bigcity.md` contains `<div data-demo></div>`.
