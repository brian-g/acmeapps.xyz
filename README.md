# acmeapps.xyz

Static site built with [Eleventy](https://www.11ty.dev/) 3.

## Requirements

Node.js >= 18. This machine currently runs Node 26 (installed via `brew install node`).

## Commands

```sh
npm install     # once
npm start       # dev server with live reload at http://localhost:8080
npm run build   # production build into _site/
npm run clean   # remove _site/
```

## Structure

```
eleventy.config.js        Eleventy config (ESM)
src/
  _data/site.js           Site metadata + nav — edit this first
  _includes/base.njk      The single page layout
  assets/css/main.css     All styling; design tokens at the top
  public/                 Copied to the site root (_headers, robots.txt)
  index.njk               Home
  about.md                Markdown page example
  404.njk                 Served automatically by Cloudflare Pages
_site/                    Build output (gitignored)
```

Add a page by dropping a `.md` or `.njk` file in `src/` with front matter:

```
---
layout: base.njk
title: Pricing
---
```

Markdown files are processed through Nunjucks, so `{{ site.title }}` and other
data work in `.md` as well as `.njk`.

## Deploying to Cloudflare Pages

Connect the repo in the Cloudflare dashboard and use:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `_site` |
| Node version | read from `.node-version` |

`.node-version` pins `22.16.0` — the Cloudflare Pages build image default, which
is guaranteed available. Local development runs a newer Node; Eleventy supports
both. Bump the file if you want CI to match local exactly.

`src/public/_headers` sets baseline security headers and long-lived caching for
`/assets/*`. Cloudflare Pages serves `404.html` for unmatched routes with no
extra configuration.
