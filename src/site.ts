// Everything personal lives here, so copy and links change in one place.
// Bracketed values are placeholders for you to replace.

export const site = {
  name: '[Your name]',
  title: '[Your title]',
  url: 'https://[your-domain]',
  description: '[One-sentence site description for search results and link previews]',
  email: '[you@domain.com]',
  links: {
    linkedin: 'https://www.linkedin.com/in/[your-handle]',
    spotify: 'https://open.spotify.com/artist/[your-id]',
    gumroad: 'https://sunshoweraudio.gumroad.com/l/bigcity',
  },
  home: {
    headline: 'I make complex products feel good to use',
    intro: '[Your 2-sentence intro]',
    interactionHint: '[Interaction hint]',
    readLabel: '[Link text, e.g. Read the case study]',
    outsideWork: {
      heading: '[Outside work heading]',
      body: '[2–3 sentences on music, live shows and plugins]',
      spotifyLabel: '[Spotify link text]',
      gumroadLabel: '[Gumroad link text]',
    },
  },
  bigcityDemo: {
    heading: '[Demo heading]',
    body: '[1–2 sentences on what City size does to the sound]',
    /**
     * One loop per City size step, all the same length and start point, e.g.
     * ['/audio/bigcity-000.m4a', '/audio/bigcity-025.m4a', ..., '/audio/bigcity-100.m4a'].
     * Leave empty to show the visual-only demo.
     */
    audio: [] as string[],
  },
  about: {
    paragraphs: ['[Sentence 1: designing and design engineering]', '[Sentence 2: indie electronic music and DJing]'],
  },
} as const;

export const nav = [
  { href: '/', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Résumé' },
  { href: '/about#contact', label: 'Contact' },
] as const;
