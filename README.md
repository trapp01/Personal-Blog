# matt-trapp

The source for my personal site — writing and notes. Built with [Astro](https://astro.build)
on top of the [Astro Cactus](https://github.com/chrismwilliams/astro-cactus) theme.

## Stack

- **Astro v6** — static site generation
- **Tailwind v4** — styling, with light/dark mode
- **MD/MDX** content collections for posts, notes, and tags
- **Pagefind** static search, **Satori** for OG images, RSS, sitemap, webmentions

## Commands

| Command           | Action                                            |
| :---------------- | :------------------------------------------------ |
| `npm install`     | Install dependencies                              |
| `npm run dev`     | Start the dev server at `localhost:3000`          |
| `npm run build`   | Build to `./dist/` (runs Pagefind afterwards)     |
| `npm run preview` | Preview the production build locally              |
| `npm run check`   | Type-check (`astro check`) and lint (`biome`)     |
| `npm run lint`    | Lint and auto-fix with Biome                      |
| `npm run format`  | Format with Prettier                              |

## Structure

- `src/content/post/` — long-form writing (`.md` / `.mdx`)
- `src/content/note/` — short notes
- `src/content/tag/` — optional per-tag page overrides
- `src/site.config.ts` — site title, URL, nav, date format
- `src/components/SocialList.astro` — social links
- `src/pages/index.astro` — the homepage (year-grouped writing index)

## Writing a post

Add a Markdown file to `src/content/post/`. The filename becomes the slug.

```md
---
title: My post title
description: A short summary used for SEO and previews.
publishDate: "2026-06-24"
tags: ["example"]
---

Your content here.
```

Notes use the same idea in `src/content/note/`, with an ISO 8601 `publishDate`
(e.g. `"2026-06-24T12:00:00Z"`).

## Credits

Based on [Astro Cactus](https://github.com/chrismwilliams/astro-cactus) by Chris Williams (MIT).
