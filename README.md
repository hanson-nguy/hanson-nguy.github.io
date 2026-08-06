# Hanson Nguyen

Personal portfolio + blog about electronics and hobby projects. Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com).

## Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Local dev server at `localhost:4321`        |
| `npm run build`   | Build production site to `./dist/`          |
| `npm run preview` | Preview the production build locally        |
| `npm run check`   | Type-check with `astro check`               |
| `npm run astro`   | Run CLI commands (e.g. `astro add`, `astro sync`) |

## Content

- **Projects** — `src/content/projects/` (portfolio showcase)
- **Blog** — `src/content/blog/` (electronics-focused writeups and tutorials)

Add a new markdown file to either folder; schema is defined in `src/content.config.ts`.

## Deploy

GitHub Pages. Push to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `dist/` to the `gh-pages` branch. Site lives at `https://hanthemanson.github.io/hansonswebsite/`.
