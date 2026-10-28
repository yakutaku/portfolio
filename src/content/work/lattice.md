---
title: "Untangling navigation for a hypergrowth HR platform"
client: "Lattice"
years: "2022"
role: "Designer + PM"
team: "Me (IA, research, wireframing), 1 designer (visual navigation updates), 1 tech lead, 2 engineers"
timeline: "3 months (Jun – Aug 2022)"
tldr: "I led research and IA for Lattice’s navigation overhaul as it grew from a few disparate products into an all-in-one HR platform. Navigation CSAT increased by 15% and time to open a review (a core action) decreased by 20%."
order: 2
cover: "/work/lattice/01-cover.webp"
coverAlt: "Lattice's 2022 side navigation, a long list of 13 tools, fading behind the redesigned navigation grouped into everyday workflows and an admin section."
tint: lilac
---

<figure class="metrics lead">
  <div class="metric">
    <p class="solari" data-solari>+15%</p>
    <p class="metric-label">Navigation CSAT after launch</p>
  </div>
  <div class="metric">
    <p class="solari" data-solari>20%</p>
    <p class="metric-label">Faster to open a review</p>
  </div>
  <figcaption>Results from the first quarter after launch.</figcaption>
</figure>

## The problem

### One more lane on the sidebar

Lattice doubled revenue in 2021 and grew past performance management and engagement into an all-in-one HR platform: goals, career development, compensation analytics, and more. Every new product got its own sidebar item. By 2022, leadership flagged navigation as a top customer complaint, and sales said the clutter was confusing prospects in EMEA, a market we were pushing into that year.

<figure>
  <img src="/work/lattice/02-before-2022-admin-nav.webp" alt="Reconstruction of Lattice&#x27;s 2022 admin home. The dark side nav lists 13 items in one long list, with Grow sitting next to Analytics. Page content is faded to focus on the nav." width="1440" height="960" loading="lazy" decoding="async">
  <figcaption>The 2022 admin sidebar.</figcaption>
</figure>

> **Hypothesis:** Cutting the sidebar down to what each person actually uses would make the platform feel simpler without a full rebuild.

## Discovery

### “It feels messy” isn’t a brief

With our tech lead and another designer, I audited the platform to find out why navigation felt bad. We called it Project Kondo, after Marie Kondo (keep only what sparks joy). Customer interviews, card sorts, sales call recordings, and product analytics kept surfacing the same three problems:

- **Back didn’t mean back:** The browser back button often dumped users on the homepage, mid-workflow.
- **Bookmarks were the real nav:** Getting anywhere took so many clicks that admins just bookmarked everything.
- **The sidebar kept sprawling:** The SaaS equivalent of the 405 in LA: one more lane will fix it, promise.

## Constraints

### Too many cooks, not enough engineers

Leadership wanted navigation fixed fast, without adding resources. Engineering was thin, tech debt was heavy, and a full rebuild was off the table. Internally, everyone had strong opinions on navigation, but no team wanted us touching their product surface.

We also couldn’t break bookmarks. For most admins, bookmarks were the navigation, so every existing URL had to stay intact.

So we drew a clear line. Our pod owned the global shell, routing, and permissions. Everything inside each product area stayed with its team. That kept the project shippable (and kept us out of endless stakeholder alignment meetings).

<figure>
  <img src="/work/lattice/06-scope-shell-not-rooms.webp" alt="App schematic. The side nav and browser back behavior are marked as changed; the page area owned by other product teams is marked as left alone. Below, scope we didn&#x27;t take on: a full teardown, redesigning team-owned navigation, and getting every team&#x27;s sign-off first." width="1440" height="854" loading="lazy" decoding="async">
  <figcaption>Navigation came down to strengthening the house while leaving the rooms alone.</figcaption>
</figure>

## The solution

### One fix per problem

- **Make back mean back:** We fixed browser back behavior without changing a single URL, so every existing bookmark kept working.
- **Organize by task, not product:** Card sorting showed people group by what they’re doing, not where it lives. We rebuilt the sidebar around core workflows: 1:1s, feedback, engagement, reviews, and goals.
- **Show each role only what it can use:** Our pod owned permissions, so we hid tools people couldn’t access, like analytics for non-admins.

Our designer owned the visual navigation updates. I owned research, wireframing, and IA.

### Revisiting it in 2026

<figure>
  <img src="/work/lattice/07-after-admin-nav-annotated.webp" alt="Redesigned admin side nav with four callouts: selected state uses a fill, a bar and bold text, not color alone; daily workflows grouped together; admin-only tools under one Admin label; 48px rows." width="1440" height="960" loading="lazy" decoding="async">
  <figcaption>The shipped admin nav structure, rebuilt in 2026.</figcaption>
</figure>

The selected state mattered more than it looked. In the 2022 nav, it was a slightly lighter gray, and color-only cues disappear for colorblind users and on low-quality monitors. A bolder color would have competed with the blue reserved for clickable elements. So in my rebuild, the selected row gets three cues: a fill, a 3px bar, and semibold text. Every label on the dark rail clears WCAG AA, and you can still tell where you are in grayscale.

<figure>
  <img src="/work/lattice/05-ia-before-and-after.webp" alt="Map from the 2022 list of 13 nav items to the new structure: Everyone (Home, People), Workflows (1:1s, Feedback, Reviews, Goals, Engagement, Grow, Updates) and Admin (Reporting, Analytics, Directory, Settings), with Compensation added later in 2022." width="1440" height="1328" loading="lazy" decoding="async">
  <figcaption>The information architecture, before and after.</figcaption>
</figure>

<figure>
  <img src="/work/lattice/08-browser-back-fix.webp" alt="Two flows. Before: from the reviews list, open a review, press the browser&#x27;s back button, land on Home. After: the same steps return you to the reviews list." width="1440" height="1064" loading="lazy" decoding="async">
  <figcaption>Back now returns people to where they were, with every existing URL intact.</figcaption>
</figure>

## What we cut

- **Grouping by product suite (performance, engagement, growth):** Tech debt made it hard, and card sorting already told us people think in tasks.
- **Collapsible sections:** An extra click for power users on every visit, and not cheap to build.
- **Pinned favorites:** Expensive (and bookmarks already did the job).

<figure>
  <img src="/work/lattice/04-how-we-got-to-workflows.webp" alt="An open card sort with HR admins and employees showed people group by task. Four nav structures compared: product suites, collapsible sections and pinned favorites were dropped; workflow groups shipped." width="1440" height="1006" loading="lazy" decoding="async">
  <figcaption>How card sorting pointed us toward workflows over product buckets.</figcaption>
</figure>

## Impact

### Smoother navigation, faster reviews

My role was eliminated in a reorg two weeks before launch. My pod later shared the results from the first quarter after launch. Navigation CSAT, measured through an in-app survey, increased by 15%. Time to open a review decreased by 20%. Power users and prospects said getting around Lattice felt noticeably smoother.

## Reflection

### What I learned

**Protect what people already rely on:** Bookmarks looked like a symptom of bad navigation, something to design away. But for most admins, they were how work got done. Breaking them would have broken real workflows.

**Ship within the constraints you have:** A perfect IA doesn’t matter if it can’t survive tech debt, a short timeline, and pressure from leadership. The best win was fixing the most painful problems using the resources we had.

## If I had more time

### Role-aware navigation

I’d push role-based navigation further, personalizing what’s surfaced by company size and real usage, so a complex product feels simple no matter how SaaS-fluent you are.

<p class="credit">Rebuilt from memory and references in Figma and Claude Code. Visuals refreshed in 2026.</p>
