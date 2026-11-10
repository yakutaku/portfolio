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
coverAlt: "The redesigned Lattice admin home. The sidebar groups tools under Everyone, Workflows and Admin, with Home selected, next to a task list and review and engagement progress cards."
tint: lilac
---

<figure class="metrics lead">
  <div class="metric">
    <p class="solari" data-solari>+15%</p>
    <p class="metric-label">User satisfaction when navigating (Navigation CSAT)</p>
  </div>
  <div class="metric">
    <p class="solari" data-solari>20%</p>
    <p class="metric-label">Faster to open a review</p>
  </div>
  <figcaption>Results from the first quarter after launch.</figcaption>
</figure>

## Overview

### Platforms: the kitchen sink of all companies

Our pod (platform) owned the foundation every Lattice product sat on: navigation, site-wide IA, permissions, accessibility, internationalization, the mobile app, integrations, notifications, settings and admin, and Company Pages. Lattice had grown from a few products into an all-in-one HR platform, so every change we made touched nearly every product team.

- **Navigation and site-wide IA:** this case study.
- **Company Pages:** I redesigned it around celebrations, feedback and key links, and DAU/MAU grew 25%.
- **Also hands-on:** accessibility, the mobile app, integrations and permissions.

## The problem

### One more lane on the sidebar

<p class="lede">As Lattice kept adding products, people couldn't find (or finish) the tasks they came for in the first place: reviews, 1:1s and goals.</p>

Lattice doubled revenue in 2021 and grew past performance management and engagement into an all-in-one HR platform: goals, career development, compensation analytics, and more. Every new product got its own sidebar item. By 2022, leadership flagged navigation as a top customer complaint, and sales said the clutter was confusing prospects in EMEA, a market we were pushing into that year.

<figure>
  <img src="/work/lattice/02-before-2022-admin-nav.webp" alt="Lattice&#x27;s 2022 admin home. The dark side nav lists 13 items in one long list, with Grow sitting next to Analytics. Page content is faded to focus on the nav." width="1440" height="960" loading="lazy" decoding="async">
  <figcaption>The 2022 admin sidebar.</figcaption>
</figure>

> **Hypothesis:** Cutting the sidebar down to what each person actually uses would make the platform feel simpler without a full rebuild.

## Discovery

### “It feels messy” isn’t a brief

With our tech lead and another designer, I audited the platform to find out why navigation felt bad. We called it Project Kondo, after Marie Kondo (keep only what sparks joy).

<div class="table-wrap">
<table>
  <thead><tr><th scope="col">Source</th><th scope="col">How much</th><th scope="col">What it pointed to</th></tr></thead>
  <tbody>
    <tr><th scope="row">Customer interviews</th><td>10+</td><td>Navigation felt clunky: “Where is everything?”</td></tr>
    <tr><th scope="row">Support tickets, CSM notes and bug reports</th><td>50+</td><td>The app “drops me in weird places” mid-workflow</td></tr>
    <tr><th scope="row">Sales calls (Gong)</th><td>~10</td><td>The clutter confused prospects, especially in EMEA</td></tr>
    <tr><th scope="row">Hotjar and site maps</th><td>Drop-off data</td><td>Where people abandoned what they came to do</td></tr>
    <tr><th scope="row">Open card sort</th><td>HR admins and employees</td><td>People group by task, not by product name</td></tr>
  </tbody>
</table>
</div>

Every source kept surfacing the same three problems:

- **Back didn’t mean back:** The browser back button often dumped users on the homepage, mid-workflow.
- **Bookmarks were the real nav:** Getting anywhere took so many clicks that admins just bookmarked everything.
- **The sidebar kept sprawling:** The SaaS equivalent of the 405 in LA: one more lane will fix it, promise.

<figure>
  <img src="/work/lattice/04-how-we-got-to-workflows.webp" alt="An open card sort with HR admins and employees showed people group by task. Four nav structures compared: product suites, collapsible sections and pinned favorites were dropped; workflow groups shipped." width="1440" height="1006" loading="lazy" decoding="async">
  <figcaption>How card sorting pointed us toward workflows over product buckets.</figcaption>
</figure>

## Trade-offs

### A bigger redesign vs. what we could ship

Our team wanted a bigger redesign. Other product teams pushed back hard, because moving their products in the nav could hurt their own goals. Leadership pressure, limited resources, and tech debt ruled out a full rebuild.

We also couldn’t change URLs. Admins linked Lattice pages in emails, Notion, Google Docs, Slack, and Teams, and for most of them bookmarks were the navigation. New URLs would have broken all of those links and added complaints about something people already hated.

So we drew a clear line. Our pod owned the global shell, routing, and permissions. Everything inside each product area stayed with its team. That kept the project shippable (and kept us out of endless stakeholder alignment meetings).

<figure>
  <img src="/work/lattice/06-scope-shell-not-rooms.webp" alt="App schematic. The side nav and browser back behavior are marked as changed; the page area owned by other product teams is marked as left alone. Below, scope we didn&#x27;t take on: a full teardown, redesigning team-owned navigation, and getting every team&#x27;s sign-off first." width="1440" height="854" loading="lazy" decoding="async">
  <figcaption>Navigation came down to strengthening the house while leaving the rooms alone.</figcaption>
</figure>

## The solution

### One fix per problem

- **Make back mean back:** Back returns people to where they were, and every URL stays the same.
- **Organize by task, not product:** Card sorting showed people group by what they’re doing, not where it lives. We rebuilt the sidebar around core workflows: 1:1s, feedback, engagement, reviews, and goals.
- **Show each role only what it can use:** Our pod owned permissions, so we hid tools people couldn’t access, like analytics for non-admins.

Another designer on our team led the final visual design while I focused on wireframes and IA.

### Making back mean back

**Why it was a big problem:** Back was the complaint I saw most. Across 10+ interviews and 50+ support tickets, people said the app dropped them in weird places mid-workflow, and our staff engineers confirmed it was a long-known problem.

**Why it was hard:** The fix had to work across every product at once, without changing a single URL. New URLs would have broken every link admins had shared in emails, Notion, Google Docs, Slack, and Teams. So it lived in the shared navigation layer our pod owned.

**Why it mattered:** Reviews, 1:1s and goals are the work people come to Lattice for. Getting dropped on Home in the middle of one meant finding your way back through the same cluttered sidebar we were already fixing.

<figure>
  <img src="/work/lattice/08-browser-back-fix.webp" alt="Step 1: open a review from the Q3 2022 reviews list. Step 2: press the browser&#x27;s back button. Before the fix, back sent you to Home, mid-workflow. After the fix, back returns you to the reviews list where you left off." width="1920" height="1730" loading="lazy" decoding="async">
  <figcaption>Back now returns people to where they were.</figcaption>
</figure>

### Revisiting it in 2026

<figure>
  <img src="/work/lattice/07-after-admin-nav-annotated.webp" alt="Redesigned admin side nav with four callouts: selected state uses a fill, a bar and bold text, not color alone; daily workflows grouped together; admin-only tools under one Admin label; 48px rows." width="1440" height="960" loading="lazy" decoding="async">
  <figcaption>The shipped admin nav structure.</figcaption>
</figure>

The selected state mattered more than it looked. In the 2022 nav, it was a slightly lighter gray, and color-only cues disappear for colorblind users and on low-quality monitors. A bolder color would have competed with the blue reserved for clickable elements. So in my rebuild, the selected row gets three cues: a fill, a 3px bar, and semibold text. Every label on the dark rail clears WCAG AA, and you can still tell where you are in grayscale.

<figure>
  <img src="/work/lattice/05-ia-before-and-after.webp" alt="Map from the 2022 list of 13 nav items to the new structure: Everyone (Home, People), Workflows (1:1s, Feedback, Reviews, Goals, Engagement, Grow, Updates) and Admin (Reporting, Analytics, Directory, Settings), with Compensation added later in 2022." width="1440" height="1328" loading="lazy" decoding="async">
  <figcaption>The information architecture, before and after.</figcaption>
</figure>

## What we cut

- **Grouping by product suite (performance, engagement, growth):** Tech debt made it hard, and card sorting already told us people think in tasks.
- **Collapsible sections:** An extra click for power users on every visit, and not cheap to build.
- **Pinned favorites:** Expensive (and bookmarks already did the job).

## Impact

### Navigation CSAT up 15%, reviews 20% faster

In the first quarter after launch, Navigation CSAT, measured through an in-app survey, increased by 15%. Time to open a review decreased by 20%. Power users and prospects said getting around Lattice felt noticeably smoother.

## Reflection

### What I learned

**Protect what people already rely on:** Bookmarks looked like a symptom of bad navigation, something to design away. But for most admins, they were how work got done. Breaking them would have broken real workflows.

**Ship within the constraints you have:** A perfect IA doesn’t matter if it can’t survive tech debt, a short timeline, and pressure from leadership. The best win was fixing the most painful problems using the resources we had.

## If I had more time

### Role-aware navigation

I’d push role-based navigation further, personalizing what’s surfaced by company size and real usage, so a complex product feels simple no matter how SaaS-fluent you are.

