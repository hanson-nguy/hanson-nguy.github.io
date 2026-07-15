// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// 4. Define a `loader` and `schema` for each collection
const posts = defineCollection({
  loader: glob({ base: 'src/content/posts', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    featured: z.boolean(),
    image: z.string(),
    categories: z.array(z.string()).optional(),
    date: z.string(),


  }),
});

// 5. Export a single `collections` object to register your collection(s)
export const collections = { posts };