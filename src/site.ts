// Everything personal lives here, so copy and links change in one place.
// Bracketed values are placeholders for you to replace.

export const site = {
  name: 'Jonathan Day',
  title: 'Designer',
  url: 'https://portfolio-nine-coral-54.vercel.app',
  /** Shown in search results and link previews. */
  description: 'I make complex products feel good to use',
  email: 'jyday@proton.me',
  links: {
    linkedin: 'https://www.linkedin.com/in/-jonathanday/',
    /** Add your artist URL to show the Spotify link. */
    spotify: '',
    gumroad: 'https://sunshoweraudio.gumroad.com/l/bigcity',
  },
  home: {
    headline: 'I make complex products feel good to use',
    /** Optional line beside the headline; leave empty to hide it. */
    intro: '',
    readLabel: 'Read',
  },
  bigcityDemo: {
    body: 'Why read more about BigCity when you can just play with it instead – try it out below!',
    /**
     * One loop per City size step, all the same length and start point.
     * Each file is padded with `padSeconds` of wrapped audio on both ends (see README).
     * Leave `files` empty to show the visual-only demo.
     */
    audio: {
      files: [
        '/audio/bigcity-000.mp3',
        '/audio/bigcity-025.mp3',
        '/audio/bigcity-050.mp3',
        '/audio/bigcity-075.mp3',
        '/audio/bigcity-100.mp3',
      ] as string[],
      loopSeconds: 19.2,
      padSeconds: 0.25,
    },
  },
  about: {
    paragraphs: [
      'Hi, I’m Jonathan. I’m a product designer and builder. For the last 10 years, I’ve been learning how to make complex products feel great to use.',
      'Outside of work, I make electronic music and DJ around SoCal and NYC.',
    ],
  },
} as const;

export const nav = [
  { href: '/', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
] as const;
