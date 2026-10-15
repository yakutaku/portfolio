---
title: "Crafting onboarding for an AI-powered IT platform"
client: "atSpoke (acquired by Okta)"
years: "2020 – 22"
role: "Designer + PM"
team: "Me, 1 designer, 1 tech lead, 3 engineers"
timeline: "3 months (Jan – Mar 2021)"
tldr: "I designed and shipped self-serve onboarding that cut onboarding time in half and took free-to-paid conversion from near zero to 16% for people who finished it."
order: 2
cover: "/work/atspoke/00-cover.webp"
coverAlt: "atSpoke's self-serve onboarding flow."
tint: mint
---

## The problem

### White glove for some, empty rooms for everyone else

Anyone who signed up for atSpoke on their own landed in empty states with zero guidance. 38% of self-serve customers were detractors, and many took over a month to file their first ticket.

<figure>
  <img src="/work/atspoke/01-before-state.webp" alt="An empty atSpoke inbox with no onboarding guidance." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>Where every self-serve signup started: an empty inbox with no guidance on what to do next.</figcaption>
</figure>

Customers onboarded by our CSMs were a different story. These folks routinely gave us a 100% on the CSAT survey, because our GTM team showed them how atSpoke, an AI-powered IT service desk, could save thousands of hours by automating repetitive work.

As an understaffed Series B startup, we couldn't give everyone a CSM.

> **Hypothesis:** Short onboarding, tailored to each person's role, would turn self-serve signups into paying customers and get new teams up to speed faster.

## Discovery

### Finding the aha moments

IT and HR managers don't have time to dig through submenus. Across 10+ customer interviews and our product analytics, the same three aha moments kept showing up:

- Connecting Slack or Teams
- Filing a first ticket
- Getting an answer from their company's knowledge base

For research, I also recorded myself onboarding into other SaaS products (Jira, Linear, Loom) and games (Animal Crossing, Overwatch). The best ones:

- Respected people's time and attention
- Taught skills in context
- Never made people fight to learn the basics

## Build

With a lean team, we couldn't build everything from scratch. We also weren't willing to drop our design standards for an out-of-the-box tool. So we split the work. We built custom flows for setup-heavy tasks (connecting Slack, inviting teammates) and used Pendo for in-product learning, restyled to match our design system. Getting Pendo (circa 2021) to match our color, type, and element targeting 1:1 was a test of patience.

Pendo saved us weeks of engineering time, but our engineering manager still worried onboarding would stall the roadmap. Thankfully, the projected conversion lift brought him on board (pun fully intended).

<figure>
  <img src="/work/atspoke/s3-guidance-spec.webp" alt="The in-product guidance spec for Pendo guides." width="1920" height="1291" loading="lazy" decoding="async">
  <figcaption>The in-product guidance spec, written so Pendo's guides matched our design system 1:1.</figcaption>
</figure>

Our designer owned the setup flows. I led research, strategy, flows, copy, and designed the in-product learning.

<figure>
  <img src="/work/atspoke/s4-voice.webp" alt="Example lines from the onboarding copy spec, each with its writing rule." width="1920" height="699" loading="lazy" decoding="async">
  <figcaption>A few favorite lines from my 2021 copy spec, and the rule behind each.</figcaption>
</figure>

## How to make onboarding worthwhile

### Less tour, more doing

**A role question up front.** The role quiz we included added friction at signup, but it meant every step after it was one that person could actually use.

<figure>
  <img src="/work/atspoke/s2-role-model.webp" alt="Diagram of how the role chosen at signup maps to onboarding steps." width="1920" height="1152" loading="lazy" decoding="async">
  <figcaption>The role question at signup decides which steps each person sees.</figcaption>
</figure>

**Practice, not a tour.** Instead of a feature tour, new users filed a practice ticket in their first minute, so they learned atSpoke by using it.

**Every step earns its time.** Our first version was longer. In beta, people lost interest after about two minutes, so we cut anything a role didn't need, like exploring team spaces for people who mostly file tickets.

## The experience

### From wireframe to final

Each step pairs the original wireframe with the shipped design, in the order a new user sees them.

<!-- Walkthrough video goes here when it arrives:
<figure>
  <div class="media-placeholder">[Walkthrough video]</div>
  <figcaption>The full onboarding flow, from an empty inbox to the finish line.</figcaption>
</figure>
-->

<figure class="compare">
  <fieldset class="compare-toggle">
    <legend class="visually-hidden">Version to show</legend>
    <label><input type="radio" name="cmp-02" value="final" checked> Final</label>
    <label><input type="radio" name="cmp-02" value="wireframe"> Wireframe</label>
  </fieldset>
  <img class="is-final" src="/work/atspoke/02-role-select.webp" alt="atSpoke onboarding, final design: role selection." width="1920" height="1712" loading="lazy" decoding="async">
  <img class="is-wireframe" src="/work/atspoke/wf-02-role-select.webp" alt="atSpoke onboarding, wireframe: role selection." width="1920" height="1653" loading="lazy" decoding="async">
  <figcaption>One question about your role shapes everything that follows.</figcaption>
</figure>

<figure class="compare">
  <fieldset class="compare-toggle">
    <legend class="visually-hidden">Version to show</legend>
    <label><input type="radio" name="cmp-03" value="final" checked> Final</label>
    <label><input type="radio" name="cmp-03" value="wireframe"> Wireframe</label>
  </fieldset>
  <img class="is-final" src="/work/atspoke/03-welcome-and-profile.webp" alt="atSpoke onboarding, final design: welcome and profile setup." width="1920" height="1200" loading="lazy" decoding="async">
  <img class="is-wireframe" src="/work/atspoke/wf-03-welcome-and-profile.webp" alt="atSpoke onboarding, wireframe: welcome and profile setup." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>A quick welcome and profile setup, kept to the essentials.</figcaption>
</figure>

<figure class="compare">
  <fieldset class="compare-toggle">
    <legend class="visually-hidden">Version to show</legend>
    <label><input type="radio" name="cmp-04" value="final" checked> Final</label>
    <label><input type="radio" name="cmp-04" value="wireframe"> Wireframe</label>
  </fieldset>
  <img class="is-final" src="/work/atspoke/04-first-request.webp" alt="atSpoke onboarding, final design: filing a first practice request." width="1920" height="1200" loading="lazy" decoding="async">
  <img class="is-wireframe" src="/work/atspoke/wf-04-first-request.webp" alt="atSpoke onboarding, wireframe: filing a first practice request." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>The practice ticket: new users file a request in their first minute.</figcaption>
</figure>

<figure class="compare">
  <fieldset class="compare-toggle">
    <legend class="visually-hidden">Version to show</legend>
    <label><input type="radio" name="cmp-05" value="final" checked> Final</label>
    <label><input type="radio" name="cmp-05" value="wireframe"> Wireframe</label>
  </fieldset>
  <img class="is-final" src="/work/atspoke/05-integration-actions.webp" alt="atSpoke onboarding, final design: running Okta and Jamf actions inside a request." width="1920" height="1200" loading="lazy" decoding="async">
  <img class="is-wireframe" src="/work/atspoke/wf-05-integration-actions.webp" alt="atSpoke onboarding, wireframe: running Okta and Jamf actions inside a request." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>Running Okta and Jamf actions right inside a request, for people who run a team.</figcaption>
</figure>

<figure class="compare">
  <fieldset class="compare-toggle">
    <legend class="visually-hidden">Version to show</legend>
    <label><input type="radio" name="cmp-06" value="final" checked> Final</label>
    <label><input type="radio" name="cmp-06" value="wireframe"> Wireframe</label>
  </fieldset>
  <img class="is-final" src="/work/atspoke/06-wiki-import.webp" alt="atSpoke onboarding, final design: importing the company knowledge base." width="1920" height="1200" loading="lazy" decoding="async">
  <img class="is-wireframe" src="/work/atspoke/wf-06-wiki-import.webp" alt="atSpoke onboarding, wireframe: importing the company knowledge base." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>Importing the company knowledge base so atSpoke can start answering questions.</figcaption>
</figure>

<figure class="compare">
  <fieldset class="compare-toggle">
    <legend class="visually-hidden">Version to show</legend>
    <label><input type="radio" name="cmp-07" value="final" checked> Final</label>
    <label><input type="radio" name="cmp-07" value="wireframe"> Wireframe</label>
  </fieldset>
  <img class="is-final" src="/work/atspoke/07-attach-a-resource.webp" alt="atSpoke onboarding, final design: attaching a resource to the knowledge base." width="1920" height="1200" loading="lazy" decoding="async">
  <img class="is-wireframe" src="/work/atspoke/wf-07-attach-a-resource.webp" alt="atSpoke onboarding, wireframe: attaching a resource to the knowledge base." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>Attaching a resource so the knowledge base is useful from day one.</figcaption>
</figure>

<figure class="compare">
  <fieldset class="compare-toggle">
    <legend class="visually-hidden">Version to show</legend>
    <label><input type="radio" name="cmp-08" value="final" checked> Final</label>
    <label><input type="radio" name="cmp-08" value="wireframe"> Wireframe</label>
  </fieldset>
  <img class="is-final" src="/work/atspoke/08-congrats.webp" alt="atSpoke onboarding, final design: the onboarding completion screen." width="1920" height="1200" loading="lazy" decoding="async">
  <img class="is-wireframe" src="/work/atspoke/wf-08-congrats.webp" alt="atSpoke onboarding, wireframe: the onboarding completion screen." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>The finish line.</figcaption>
</figure>

## Impact

### From near zero to a new channel

We launched onboarding in March 2021. Of the customers who completed it, 16% upgraded to a paid plan (up from nearly zero). People who finish onboarding tend to be more motivated, so onboarding can't take credit for all of that lift. Average onboarding time also dropped by half. The bigger shift was that sales started treating self-serve as its own channel.

Okta acquired us in Q3 2021 for ~$79M, and their leadership called out our onboarding as especially strong compared to other SaaS products. Unfortunately, atSpoke was sunset a few months later, but hey, that's startup life for you.

## What I'd do differently

**Choose tools for the long run, not the launch.** Pendo saved us weeks up front, but its element targeting was unreliable, and support calls and emails kept pulling me off other projects. WalkMe cost more, but it was more flexible around element targeting and had a better technical support team.

**Get to customers sooner.** I'd put prototypes in front of customers sooner and run a lighter process. Direct customer feedback is worth infinitely more than the perfect spec (or in Overwatch parlance: you learn more by playing than you do researching the perfect keyboard settings for your main).

<p class="credit">Visuals reconstructed from the original design spec.</p>
