---
title: "Building a one-knob plugin for music producers"
client: "BigCity"
years: "2026"
role: "Design engineer (solo)"
team: "Me (plus several producers as beta testers)"
timeline: "Sep – Oct 2026"
tldr: "I designed and built BigCity, a plugin that adds city pop sparkle to any track at <1% CPU."
order: 3
cover: "/work/bigcity/01-cover.webp"
coverRatio: "16 / 9"
coverAlt: "BigCity: the air and leisure of city pop, available with the twist of a knob. The plugin shows a City size knob set to 50 and a pixel skyline at sunset."
tint: peach
tag: "Demo"
links:
  - label: "Get it on Gumroad"
    href: "https://sunshoweraudio.gumroad.com/l/bigcity"
  - label: "View the code"
    href: "https://github.com/yakutaku/BigCity"
demo: true
---

<figure class="metrics lead">
  <div class="metric">
    <p class="solari" data-solari>&lt;1%</p>
    <p class="metric-label">CPU per instance</p>
  </div>
  <figcaption>Launched October 2026. Used by Unknown Caller and other touring electronic artists.</figcaption>
</figure>

## The problem

### Lost in the menus

Music production is complex at every layer: the idea, the sound design, the software itself. I've lost hours in submenus of submenus chasing a sound that plays for 1.5 seconds (and that most listeners will never notice).

If a track sounds dull and I want it to shine a bit more, it can take 3–4 plugins and 10+ knobs for one texture. The CPU adds up on older laptops, some of those plugins are $100–200, and by the time it sounds right the momentum I had is gone. Slate Digital's [Fresh Air](https://slatedigital.com/fresh-air/) gets closer, but it's still two knobs.

<figure>
  <img src="/work/bigcity/02b-workflow.webp" alt="Adding air to one track today takes four plugins in a chain, and each fix creates the next problem. An EQ high shelf at 10 to 12 kHz makes the S's harsh. A de-esser fixes that but makes it sound narrow. A width plugin fixes that but makes it louder. A gain match and A/B by ear checks whether it's better or just louder. Repeat on every track: 3 to 4 plugins, 10+ knobs, $100 to 200 per plugin, and CPU that adds up on older laptops. Root cause: air is three small moves, and today each one lives in a different plugin with its own UI. BigCity: one knob does all three (high shelf, micro-shift width and loudness match)." width="1920" height="1040" loading="lazy" decoding="async">
  <figcaption>Adding air today, and what BigCity replaces.</figcaption>
</figure>

<figure>
  <img src="/work/bigcity/02-early-sketch.webp" alt="An early BigCity concept: a light cream panel with the BigCity wordmark, a City size knob at 68.8, a pastel pixel skyline and an FX on/bypass switch." width="1516" height="796" loading="lazy" decoding="async">
  <figcaption>Where BigCity started.</figcaption>
</figure>

> **Hypothesis:** Map a few parameters to one knob and make every position sound good, so producers get the sound without the rabbit hole.

## Discovery

### Too expensive, too heavy, too deep

I talked to 10+ producers across backgrounds and skill levels. Nobody asked for more features. They asked for less:

- **Too expensive:** $100–200 for one texture stings after spending $400+ on a DAW.
- **Too heavy:** Bedroom producers often run older MacBooks that choke on long plugin chains.
- **Too deep:** The joy of a new sound dies somewhere in a submenu of a submenu.

## The solution

### One knob, one job

**Define the sound first:** City pop is a niche Japanese genre from the '70s and '80s, and its sheen is hard to fake. I defined “sparkle” as a high-shelf boost around 10–12 kHz (the “air” band where mixes get their shine) plus a subtle micro pitch shift. Then I mapped everything to one knob.

**Every position sounds good:** City size runs from 0 (LittleCity) to 100 (BigCity). At 0, your audio passes through untouched. Each knob position has a precomputed gain offset for loudness compensation, so you hear sparkle, not just a volume bump.

<figure>
  <img src="/work/bigcity/03-knob-mapping.webp" alt="Diagram of how City size drives three parameters at once." width="1920" height="816" loading="lazy" decoding="async">
  <figcaption>One knob, three parameters.</figcaption>
</figure>

**Tune by ear, not by number:** The one-knob part of my hypothesis held up. What I got wrong was how strong it should be. In beta testing, 50 (the default) sounded too subtle. Instead of just turning the number up, I rendered one of my own tracks through three stronger curves and kept the one that held up on studio monitors, laptop speakers, and earbuds. All three were rendered on the beta loop and compared by ear; A sounded best, and it was the only one that fixed the default without changing the top.

After launch, testers still found it too subtle on some tracks, even at 100. So 1.1 doubles the range: the new 50 is 1.0's 100. I tested three more voicings (Gentle, Medium and Literal double), with Medium winning because it goes further at the top without warble or harshness.

<figure>
  <img src="/work/bigcity/04-knob-response.webp" alt="Line chart of air at 10 kHz by City size. Pre-beta is a straight line to +7.8 dB at 100, with +3.9 dB at 50. 1.0 bends upward to +5.5 dB at 50 and the same +7.8 dB at 100. 1.1 reaches +7.8 dB at 50 and +10.0 dB at 100." width="1920" height="960" loading="lazy" decoding="async">
  <figcaption>Two rounds of tuning by ear: 1.0 bent the knob, and 1.1 doubled its range.</figcaption>
</figure>

**Nothing else on the panel:** No presets (one knob doesn’t need a preset browser) and no extra controls (every extra knob is a submenu waiting to happen).

## The experience

### From first pass to final

My first Figma pass didn't feel great to look at and lacked the visual texture I was aiming for, so I scrapped it and rebuilt from the ground up.

<figure>
  <img src="/work/bigcity/05-first-pass.webp" alt="The first pass at the BigCity interface: a flat cream panel with a knob, a 50.0% readout, a dense pixel skyline and an FX on/bypass switch." width="768" height="416" loading="lazy" decoding="async">
  <figcaption>The first pass.</figcaption>
</figure>

<figure>
  <img src="/work/bigcity/05a-v2.webp" alt="Version 2 of the BigCity interface: the first full layout, with screws, pastel stripes, a pixel skyline, a City size knob at 50 and an FX on/bypass switch." width="1536" height="832" loading="lazy" decoding="async">
  <figcaption>v2: the first full layout, with screws, stripes, skyline, knob and switch.</figcaption>
</figure>

<figure>
  <img src="/work/bigcity/05b-v4.webp" alt="Version 4 of the BigCity interface: aged paper texture with scuffs, a sunset skyline, a redesigned knob and an LCD readout showing 50.0." width="1536" height="832" loading="lazy" decoding="async">
  <figcaption>v4: paper texture, scuffs, aging, screwdriver slips, and an LCD readout with burned-in segments.</figcaption>
</figure>

<figure>
  <img src="/work/bigcity/06b-sunset-options.webp" alt="Three sunset options for the skyline. A, golden hour: warm gold sun and a peach-to-lavender sky. B, city pop dusk, marked picked: an indigo sky into coral with a striped retro sun. C, pink hour: pastel pink and apricot." width="1920" height="747" loading="lazy" decoding="async">
  <figcaption>Sunset options. B, city pop dusk, made the cut.</figcaption>
</figure>

<figure>
  <img src="/work/bigcity/06-final-plugin.webp" alt="The BigCity 1.1 plugin at City size 100: the knob turned all the way up, a dusk skyline with lit windows, and the FX on/bypass switch." width="1536" height="831" loading="lazy" decoding="async">
  <figcaption>BigCity 1.1.</figcaption>
</figure>

<figure>
  <video src="/work/bigcity/11-demo.mp4" poster="/work/bigcity/11-demo-poster.webp" width="1536" height="832" controls preload="none" playsinline></video>
  <figcaption>City size from 0 to 100, then bypass on and off. Sound on.</figcaption>
</figure>

**A skyline that shows what you hear:** A beta tester asked, “What if the dial controlled time of day too?” I changed the design so the sun sets from midday to dusk as the city grows and the knob moves from 0 to 100. The water shimmers too (a small nod to how giddy I felt seeing that effect in Pokémon Silver on my old Game Boy).

<figure>
  <img src="/work/bigcity/07-time-of-day.webp" alt="The skyline at City size 0 (midday), 25 (afternoon), 50 (golden hour), 75 (sunset) and 100 (dusk), with more windows lit as the city grows." width="1920" height="436" loading="lazy" decoding="async">
  <figcaption>City size 0 to 100.</figcaption>
</figure>

**Intentional texture:** I wanted BigCity to feel like something you’d find in a vintage shop in Shimokitazawa, so I added scuffs, yellowing around the edges, and a burn-in on the number counter.

**Bypass you can see:** Flip the switch and the skyline fades to grey in 200 ms: long enough to see, short enough to feel instant.

**Retro-future identity:** I chose Jost for the typeface and the brand name sits in katakana: サンシャワー・オーディオ (“sunshower audio”). My first logo felt basic, so I redrew it to match the summer pastel palette of the pixel skyline.

<figure>
  <img src="/work/bigcity/08-logo-before-after.webp" alt="The original sunshower audio logo next to the redrawn pastel version." width="1920" height="832" loading="lazy" decoding="async">
  <figcaption>The logo, before and after.</figcaption>
</figure>

<div data-demo></div>

## Build

### One click and you're deleted

<p class="pull">Modern plugins are CPU-hungry, and on older machines that means clicks, pops, and dropouts mid-session, forcing producers to freeze and flatten tracks just to keep working. Every extra step pulls them out of creative flow.</p>

Real-time audio is unforgiving. One click, pop, or crash and a producer decides your plugin isn't worth it.

I built BigCity as a VST3 so it could work beyond Ableton. Since that cost extra build time, v1 is Mac-only with Windows support coming soon.

<figure>
  <img src="/work/bigcity/09-signal-flow.webp" alt="Signal flow diagram of the BigCity audio path." width="1920" height="848" loading="lazy" decoding="async">
  <figcaption>The signal flow.</figcaption>
</figure>

Nothing shipped without passing:

- pluginval, the industry-standard plugin validator, at its strictest level
- 135 automated tests, including proof that City size 0 leaves audio untouched at every sample rate from 44.1 to 192 kHz
- A CPU benchmark on every change (final: ~0.9% per instance on an M4 Max)
- Apple code signing and notarization, so it installs without Gatekeeper warnings

**Measure before you cut:** With the window open, the water shimmer looked like it added 220 MB of memory. I decided if the memory stuck around after closing the window, the shimmer was out. Memory dropped from 282 MB to 67 MB the moment the window closed (the real cost came from JUCE’s macOS renderer) so the shimmer stayed. A pretty detail is fine as long as it doesn't slow producers down.

<figure>
  <img src="/work/bigcity/10-memory.webp" alt="Chart of plugin memory use with the window open versus closed." width="1920" height="896" loading="lazy" decoding="async">
  <figcaption>Memory with the window open vs. closed.</figcaption>
</figure>

### Where AI fit in

I wrote the spec, designed BigCity in Figma, and chose the architecture. Claude Code explained JUCE and wrote first-draft code, which I reviewed and tested in real-time.

<p class="pull">But AI is genuinely terrible at critical listening.</p>

Claude Code’s first draft led to jumps between values, so sweeping the knob caused zipper noise (that harsh, robotic sound nobody likes). I caught it through ear testing on multiple speakers and headphones and added parameter smoothing so the sound glides between values.

Claude Code was great for v1.0 but it’s no substitute for judgment in a niche this specific.

## Impact

### Signed, shipped, and at any price

BigCity launched on [Gumroad](https://sunshoweraudio.gumroad.com/l/bigcity) on October 13, 2026, as pay-what-you-want, including $0. It's a small part of making a good song, so I wanted newer producers to be able to use it.

Early signal is good. City pop producer “Unknown Caller” tried it on multiple tracks with no CPU hit and said, “All my homies hate two knobs.” [Vaperror](https://open.spotify.com/artist/0AEVuiJFczDd4dkmZh2Kha), an international touring electronic artist, called it “a stereoizer with a ‘smoother’ feel than Ableton Utility.”

Back to the hypothesis: one knob, and every position sounds good. One knob held up; the strength took two rounds to get right. The engineering side holds up. Audio is untouched at 0, loudness stays close to matched across the dial, and the plugin is light enough to forget. Whether it keeps producers out of the rabbit hole is too early to call. The signal I care about most: producers sending me tracks that use it.

## What's next

### Beyond the Mac

Windows and AU versions are next, plus cheaper UI redraws to bring that renderer memory down.

<p class="credit">Designed in Figma. Built in JUCE and C++ with Claude Code.</p>
