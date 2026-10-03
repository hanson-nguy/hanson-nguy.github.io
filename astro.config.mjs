// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://hanson-nguy.github.io',
  base: '/hansonswebsite/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});
