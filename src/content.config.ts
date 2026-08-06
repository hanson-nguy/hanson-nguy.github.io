// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
    draft: z.boolean().default(false),
  }),
});

// Export a single `collections` object to register your collections
export const collections = { projects, blog };
