import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    /** Shown as "client // years", e.g. "atSpoke (acquired by Okta) // 2020–22". */
    client: z.string(),
    years: z.string(),
    role: z.string(),
    team: z.string(),
    timeline: z.string(),
    tldr: z.string(),
    /** Optional shorter line for the home page; falls back to the TL;DR. */
    summary: z.string().optional(),
    order: z.number(),
    /** Path under /public, e.g. /work/atspoke/00-cover.webp. Omit to show a coloured placeholder. */
    cover: z.string().optional(),
    coverAlt: z.string().default(''),
    /** Cover aspect ratio on the case study page, e.g. "16 / 9". */
    coverRatio: z.string().default('16 / 10'),
    /** Pastel behind the cover; also used for the placeholder. */
    tint: z.enum(['mint', 'lilac', 'peach', 'lemon']),
    tag: z.string().optional(),
    /** Embeds the BigCity demo where the body contains <div data-demo></div>. */
    demo: z.boolean().default(false),
  }),
});

export const collections = { work };
