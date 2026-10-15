---
title: "Designing a one-knob plugin for music producers"
client: "BigCity"
years: "2026"
role: "Design engineer (solo)"
team: "Me, plus several producer friends as beta testers"
timeline: "Sep–Oct 2026"
tldr: "I designed and built BigCity, a one-knob plugin that adds city pop sparkle to any track at under 1% CPU, and shipped it pay-what-you-want."
order: 3
cover: "/work/bigcity/01-cover.webp"
coverRatio: "16 / 9"
coverAlt: "BigCity: the air and leisure of city pop, available with the twist of a knob. The plugin shows a City size knob set to 50 and a pixel skyline at sunset."
tint: peach
tag: "Interactive demo"
demo: true
---


## The problem

### Submenus all the way down

Music production is complex at every layer: the idea, the sound design, the software itself. I've lost hours in submenus of submenus chasing a sound that plays for 1.5 seconds and that most listeners will never notice.

Plugins are supposed to help. Too many of them are expensive, use a lot of CPU, and come with a whole new UI to learn.

<figure>
  <div class="media-placeholder">[Image: 02-early-sketch]</div>
  <figcaption>Where BigCity started.</figcaption>
</figure>

> **Hypothesis:** Map a few parameters to one knob and make every position sound good, so producers get the sound without the rabbit hole.

## Discovery

### Too expensive, too heavy, too deep

I talked to 10+ producers across backgrounds and skill levels. The same three complaints kept coming up:

- **Too expensive.** $100–200 for one texture stings after spending $400+ on a DAW.
- **Too heavy.** Bedroom producers often run older MacBooks that choke on long plugin chains.
- **Too deep.** The joy of a new sound dies somewhere in a submenu of a submenu.

## The solution

### One knob, one job

**Define the sound first.** City pop is a niche Japanese genre from the '70s and '80s, and its sheen is hard to fake. I defined "sparkle" as a high-shelf boost around 10–12 kHz plus a subtle micro pitch shift. That's the "air" band, where mixes get their shine. Then I mapped everything to one knob.

**Every position sounds good.** City size runs from 0 (LittleCity) to 100 (BigCity). At 0, your audio passes through untouched. Each knob position has a precomputed gain offset. You hear sparkle, not just a volume bump, and loudness matching costs almost nothing.

<figure>
  <img src="/work/bigcity/03-knob-mapping.webp" alt="Diagram of how City size drives three parameters at once." width="1920" height="816" loading="lazy" decoding="async">
  <figcaption>One knob, three parameters.</figcaption>
</figure>

**Tune by ear, not by number.** Beta testers loved the design. They were less sold on the sound: at 50, the default, the effect was too subtle. Instead of just turning the number up, I rendered one of my own tracks through three stronger curves. I picked one by ear after listening on multiple speakers and headphones. The result has the same loudness and more character.

<figure>
  <img src="/work/bigcity/04-knob-response.webp" alt="Chart comparing the knob response curve before and after beta." width="1920" height="864" loading="lazy" decoding="async">
  <figcaption>The knob response, before and after beta.</figcaption>
</figure>

**Every feature earns its place.** No presets: one knob doesn't need a preset browser. No extra controls: every extra knob is a submenu waiting to happen. No Windows or AU yet: Mac VST3 comes first.

## The experience

### From wireframe to final

<figure>
  <div class="media-placeholder">[Image: 05-wireframe]</div>
  <figcaption>The first wireframe.</figcaption>
</figure>

<figure>
  <img src="/work/bigcity/06-final-plugin.webp" alt="The BigCity 1.0 plugin: a City size knob, a pixel skyline display and an FX on/bypass switch." width="1536" height="831" loading="lazy" decoding="async">
  <figcaption>BigCity 1.0.</figcaption>
</figure>

**A skyline that shows what you hear.** Turn the knob up and the windows light up one by one. A beta tester asked, "What if the dial controlled time of day too?" So now the sun sets from midday to dusk as the city grows. The water shimmers too, a nod to how giddy I felt seeing that effect in Pokémon on my old Game Boy.

<div data-demo></div>

**Bypass you can see.** Flip the switch and the skyline fades to grey in 200 ms: long enough to see, short enough to feel instant. No guessing whether it's on.

**A retro-future identity.** Jost sets the type, and the brand name sits in katakana: サンシャワー・オーディオ ("sunshower audio"). My first logo felt basic, so I redrew it to match the summer pastel palette of the pixel skyline.

<figure>
  <img src="/work/bigcity/08-logo-before-after.webp" alt="The original sunshower audio logo next to the redrawn pastel version." width="1920" height="832" loading="lazy" decoding="async">
  <figcaption>The logo, before and after.</figcaption>
</figure>

## Build

### One click and you're deleted

Real-time audio is unforgiving. One click, pop, or crash and a producer decides your plugin isn't worth it.

I built BigCity as a VST3 so it could work beyond Ableton. That cost extra build time. v1 is Mac-only; Windows is its own project.

<figure>
  <img src="/work/bigcity/09-signal-flow.webp" alt="Signal flow diagram of the BigCity audio path." width="1920" height="848" loading="lazy" decoding="async">
  <figcaption>The signal flow.</figcaption>
</figure>

Nothing shipped without passing:

- pluginval, the industry-standard plugin validator, at its strictest level
- 124 automated tests, including proof that City size 0 leaves audio untouched at every sample rate from 44.1 to 192 kHz
- A CPU benchmark on every change (final: ~0.9% per instance on an M4 Max)
- Apple code signing and notarization, so it installs without Gatekeeper warnings

**Measure, don't guess.** With the window open, the water shimmer looked like it added 220 MB of memory. Before measuring, I set a rule: if the memory stuck around after closing the window, the shimmer was out. Memory dropped from 282 MB to 67 MB the moment the window closed. The real cost came from JUCE's macOS renderer, not the shimmer, so the shimmer stayed.

<figure>
  <img src="/work/bigcity/10-memory.webp" alt="Chart of plugin memory use with the window open versus closed." width="1920" height="896" loading="lazy" decoding="async">
  <figcaption>Memory with the window open vs. closed.</figcaption>
</figure>

**Where AI fit in.** I wrote the spec, designed BigCity, and chose the architecture. Claude Code explained JUCE and wrote first-draft code, which I reviewed and redirected. But it couldn't hear. Parameters jumped in steps instead of gliding, so sweeping the knob sounded stepped and robotic. I caught it by ear, and we smoothed each parameter so it glides between values. Claude Code was great for v1.0. It's no substitute for judgment in a niche this specific.

## Impact

### Signed, shipped, and at any price

BigCity launched on Gumroad on October 13, 2026, as pay-what-you-want, including $0. It's a small part of making a good song, so I wanted newer producers to be able to use it.

Back to the hypothesis: one knob, and every position sounds good. The engineering side holds up. Audio is untouched at 0, loudness stays close to matched across the dial, and the plugin is light enough to forget. Whether it keeps producers out of the rabbit hole is too early to call. The signal I care about most: producers sending me tracks that use it.

## What I learned

- **Constraints make better products.** One knob means BigCity does one thing, and hopefully does it really well.
- **Build for people you care about.** I've been part of the producer and DJ community for years. Pay-what-you-want means anyone in it can use this.

## What's next

### Beyond the Mac

Windows and AU versions are next, plus cheaper UI redraws to bring that renderer memory down.

<p class="credit">Designed in Figma. Built in JUCE and C++ with Claude Code.</p>
