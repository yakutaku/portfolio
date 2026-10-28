---
title: "Crafting onboarding for an AI-powered IT platform"
client: "atSpoke (acquired by Okta)"
years: "2020 – 22"
role: "Designer + PM"
team: "Me (in-product onboarding design), 1 designer (integrations setup), 1 tech lead, 3 engineers"
timeline: "3 months (Jan – Mar 2021)"
tldr: "I designed and shipped self-serve onboarding that cut onboarding time in half and took free-to-paid conversion from near zero to 16% for people who finished it."
order: 1
cover: "/work/atspoke/00-cover.webp"
coverAlt: "atSpoke's self-serve onboarding flow."
tint: mint
---

<figure class="metrics lead">
  <div class="metric">
    <p class="solari" data-solari>-50%</p>
    <p class="metric-label">Onboarding time</p>
  </div>
  <div class="metric">
    <p class="solari" data-solari>16%</p>
    <p class="metric-label">Free-to-paid conversion for people who finished onboarding, up from near zero</p>
  </div>
  <figcaption>Launched March 2021. Okta acquired atSpoke later that year and called out the onboarding.</figcaption>
</figure>

## The problem

### White glove for some, empty rooms for everyone else

<p class="pull">A blank screen is the least welcoming place on the internet, especially in a product this powerful.</p>

Anyone who signed up for atSpoke on their own landed in empty states with zero guidance. 38% of self-serve customers gave us a low CSAT score, and many took over a month to file their first ticket.

<figure>
  <img src="/work/atspoke/01-before-state.webp" alt="An empty atSpoke inbox with no onboarding guidance." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>Where every self-serve signup started: an empty inbox with no guidance on what to do next.</figcaption>
</figure>

Customers onboarded by our CSMs were a different story. These folks routinely gave us a 100% on the CSAT survey, because our GTM team showed them how atSpoke, an AI-powered IT service desk, could save thousands of hours by automating repetitive work.

As an understaffed Series B startup, we couldn't give everyone a CSM.

> **Hypothesis:** Short onboarding, tailored to each person's role, would turn self-serve signups into paying customers and get new teams up to speed faster.

## Discovery

### Finding the aha moments

IT and HR managers don't have time for a long tour. Across 10+ customer interviews and our product analytics, customers who stuck around had all hit the same moments:

- Connecting Slack or Teams
- Filing a first ticket
- Getting an answer from their company's knowledge base

For research, I also recorded myself onboarding into other SaaS products (Jira, Linear, Loom) and games (Animal Crossing). The best ones:

- Respected people's time and attention
- Taught skills in context
- Never made people fight to learn the basics

## Iterations

### From 18 steps to 6

My first version tried to teach everything. I assumed IT and HR managers wanted thorough training. The tour ran 18 steps and covered the whole product: every sidebar section, request types, ticket actions, settings, team spaces and connecting a knowledge base.

<figure class="pair">
  <img src="/work/atspoke/v1-tour-step-2.webp" alt="Version 1 of the tour, step 2 of 18: a tooltip over an empty inbox introducing team spaces." width="1920" height="1200" loading="lazy" decoding="async">
  <img src="/work/atspoke/v1-tour-step-5.webp" alt="Version 1 of the tour, step 5 of 18: a tooltip introducing the analytics dashboard." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>Version 1, reconstructed: steps 2 and 5 of 18.</figcaption>
</figure>

Customer interviews showed the opposite. Users were too busy for a long tour and wanted to learn quickly, so I rebuilt it around the three aha moments.

<figure>
  <img src="/work/atspoke/s6-iterations.webp" alt="Three versions of onboarding. Version 1, teach everything: 18 steps, failed because users were too busy for a long tour. Version 2, focus on aha moments: 7 steps tailored to each role, failed because people lost interest after about 2 minutes. Version 3, core actions with no fluff: 6 steps, onboarding time dropped by half." width="1920" height="1163" loading="lazy" decoding="async">
  <figcaption>Version 3 runs 4 to 7 steps depending on role, and 6 for team admins.</figcaption>
</figure>

## How to make onboarding worthwhile

### Less tour, more doing

**A role question up front:** The role quiz we included added friction at signup, but it meant every step after it was one that person could actually use.

<figure>
  <img src="/work/atspoke/s2-role-model.webp" alt="Diagram of how the role chosen at signup maps to onboarding steps." width="1920" height="1152" loading="lazy" decoding="async">
  <figcaption>The role question at signup decides which steps each person sees.</figcaption>
</figure>

**Practice, not a tour:** Instead of a feature tour, new users filed a practice ticket in their first minute, so they learned atSpoke by using it.

**Every step earns its time:** Version 2 was still too long. In beta, people lost interest after about two minutes, so we cut anything a role didn't need, like exploring team spaces for people who mostly file tickets.

## Build

With a lean team, we couldn't build everything from scratch. We also weren't willing to drop our design standards for an out-of-the-box tool. So we split the work. We built custom flows for setup-heavy tasks (connecting Slack, inviting teammates) and used Pendo for in-product learning, restyled to match our design system. Getting Pendo (circa 2021) to match our color, type, and element targeting 1:1 was a test of patience.

Pendo saved us weeks of engineering time, but our engineering manager still worried onboarding would stall the roadmap. Thankfully, the projected conversion lift brought him on board.

<figure>
  <img src="/work/atspoke/s3-guidance-spec.webp" alt="The in-product guidance spec for Pendo guides." width="1920" height="1291" loading="lazy" decoding="async">
  <figcaption>The in-product guidance spec, written so Pendo's guides matched our design system 1:1.</figcaption>
</figure>

Our designer owned the setup flows. I led research, strategy, flows, copy, and designed the in-product learning.

<figure>
  <img src="/work/atspoke/s4-voice.webp" alt="Example lines from the onboarding copy spec, each with its writing rule." width="1920" height="699" loading="lazy" decoding="async">
  <figcaption>A few favorite lines from my 2021 copy spec, and the rule behind each.</figcaption>
</figure>

## The experience

### Step by step

Each step, in the order a new user sees it.

<!-- Walkthrough video goes here when it arrives:
<figure>
  <div class="media-placeholder">[Walkthrough video]</div>
  <figcaption>The full onboarding flow, from an empty inbox to the finish line.</figcaption>
</figure>
-->

<figure>
  <img src="/work/atspoke/02-role-select.webp" alt="atSpoke onboarding, role selection." width="1920" height="1712" loading="lazy" decoding="async">
  <figcaption>One question about your role shapes everything that follows.</figcaption>
</figure>

<figure>
  <img src="/work/atspoke/03-welcome-and-profile.webp" alt="atSpoke onboarding, welcome and profile setup." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>A quick welcome and profile setup, kept to the essentials.</figcaption>
</figure>

<figure>
  <img src="/work/atspoke/04-first-request.webp" alt="atSpoke onboarding, filing a first practice request." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>The practice ticket: new users file a request in their first minute.</figcaption>
</figure>

<figure>
  <img src="/work/atspoke/05-integration-actions.webp" alt="atSpoke onboarding, running Okta and Jamf actions inside a request." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>Running Okta and Jamf actions right inside a request, for people who run a team.</figcaption>
</figure>

<figure>
  <img src="/work/atspoke/06-wiki-import.webp" alt="atSpoke onboarding, importing the company knowledge base." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>Importing the company knowledge base so atSpoke can start answering questions.</figcaption>
</figure>

<figure>
  <img src="/work/atspoke/07-attach-a-resource.webp" alt="atSpoke onboarding, attaching a resource to the knowledge base." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>Attaching a resource so the knowledge base is useful from day one.</figcaption>
</figure>

<figure>
  <img src="/work/atspoke/08-congrats.webp" alt="atSpoke onboarding, the onboarding completion screen." width="1920" height="1200" loading="lazy" decoding="async">
  <figcaption>The finish line.</figcaption>
</figure>

## Impact

### From near zero to a new channel

We launched onboarding in March 2021. Of the customers who completed it, 16% upgraded to a paid plan (up from nearly zero). People who finish onboarding tend to be more motivated, so onboarding can't take credit for all of that lift. Average onboarding time also dropped by half. The bigger shift was that sales started treating self-serve as its own channel.

Okta acquired us in Q3 2021 for ~$79M, and their leadership called out our onboarding as especially strong compared to other SaaS products. Unfortunately, atSpoke was sunset a few months later.

## What I'd do differently

**Choose tools for the long run, not the launch:** Pendo saved us weeks up front, but its element targeting was unreliable, and support calls and emails kept pulling me off other projects. WalkMe cost more, but it was more flexible around element targeting and had a better technical support team.

**Get to customers sooner:** I'd put prototypes in front of customers sooner and run a lighter process. Direct customer feedback is worth more than the perfect spec.

<p class="credit">Visuals reconstructed from the original design spec.</p>
