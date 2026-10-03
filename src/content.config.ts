// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Define a `loader` and `schema` for each collection
const projects = defineCollection({
  loader: glob({ base: 'src/content/projects', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    tags: z.array(z.string()),
    parts: z.array(z.string()).optional(),
    year: z.number(),
    status: z.enum(['completed', 'in-progress', 'planned']),
    category: z.enum(['academic', 'hobby']),
    featured: z.boolean().default(false),
    links: z
      .object({
        github: z.string().url().optional(),
        demo: z.string().url().optional(),
      })
      .optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ base: 'src/content/blog', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    image: z.string(),
    tags: z.array(z.string()),
    category: z.enum(['academic', 'hobby']),
    draft: z.boolean().default(false),
  }),
});

const publications = defineCollection({
  loader: glob({ base: 'src/content/publications', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    citations: z.number().default(0),
    link: z.string().url(),
  }),
});

// Export a single `collections` object to register your collections
export const collections = { projects, blog, publications };
