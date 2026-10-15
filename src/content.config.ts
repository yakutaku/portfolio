import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    years: z.string(),
    role: z.string(),
    team: z.string(),
    outcome: z.string(),
    order: z.number(),
    /** Path under /public, e.g. /work/atspoke/cover.png. Omit to show a coloured placeholder. */
    cover: z.string().optional(),
    coverAlt: z.string().default(''),
    /** Pastel behind the cover; also used for the placeholder. */
    tint: z.enum(['mint', 'lilac', 'peach', 'lemon']),
    tag: z.string().optional(),
    /** Embeds the BigCity demo where the body contains <div data-demo></div>. */
    demo: z.boolean().default(false),
  }),
});

export const collections = { work };
