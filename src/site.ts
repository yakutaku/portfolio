// Everything personal lives here, so copy and links change in one place.
// Bracketed values are placeholders for you to replace.

export const site = {
  name: 'Jonathan Day',
  title: 'Designer',
  url: 'https://[your-domain]',
  description: '[One-sentence site description for search results and link previews]',
  email: 'jyday@proton.me',
  links: {
    linkedin: 'https://www.linkedin.com/in/-jonathanday/',
    /** Add your artist URL to show the Spotify link. */
    spotify: '',
    gumroad: 'https://sunshoweraudio.gumroad.com/l/bigcity',
  },
  home: {
    headline: 'I make complex products feel good to use',
    intro: '[Your 2-sentence intro]',
    readLabel: 'Read',
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
     * One loop per City size step, all the same length and start point.
     * Each file is padded with `padSeconds` of wrapped audio on both ends (see README).
     * Leave `files` empty to show the visual-only demo.
     */
    audio: {
      files: [
        '/audio/bigcity-000.m4a',
        '/audio/bigcity-025.m4a',
        '/audio/bigcity-050.m4a',
        '/audio/bigcity-075.m4a',
        '/audio/bigcity-100.m4a',
      ] as string[],
      loopSeconds: 19.2,
      padSeconds: 0.25,
    },
  },
  about: {
    paragraphs: ['[Sentence 1: designing and design engineering]', '[Sentence 2: indie electronic music and DJing]'],
  },
} as const;

export const nav = [
  { href: '/', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
] as const;
