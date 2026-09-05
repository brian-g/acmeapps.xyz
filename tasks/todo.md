# Todo

## Bootstrap Eleventy site (2026-09-05) — complete

- [x] Install Node (`brew install node` → v26.8.1, npm 11.19.0)
- [x] `package.json` — ESM, single dev dependency `@11ty/eleventy` ^3.1.6
- [x] `eleventy.config.js` — src/_site dirs, passthrough copy, njk for md+html
- [x] `src/_data/site.js` — title, description, url, author, nav
- [x] `src/_includes/base.njk` — layout with head meta, nav, skip link, footer
- [x] `src/assets/css/main.css` — tokens, dark mode, fluid type, no build step
- [x] Pages: `index.njk`, `about.md`, `404.njk`
- [x] `src/public/` — `_headers`, `robots.txt`
- [x] `.gitignore`, `.node-version`, `README.md`
- [x] Verify: build exits 0, all expected files emitted
- [x] Verify: no unrendered `{{ }}` / `{% %}` in output, site data interpolated
- [x] Verify: dev server returns 200 for `/`, `/about/`, `/assets/css/main.css`, `/404.html`

## Review

Scaffold is intentionally minimal — one dependency, one layout, one stylesheet.
Nunjucks ships inside Eleventy 3, so no separate template package was needed.

Verified end to end rather than assumed: the build emits
`index.html`, `about/index.html`, `404.html`, `assets/css/main.css`, `_headers`,
`robots.txt`; a grep across the output confirms every template expression
rendered (title, nav with `aria-current`, canonical URL, footer year, mailto
link from site data); the dev server answered 200 on all four routes.

Deliberately deferred: blog/collections, RSS, sitemap, image optimization,
syntax highlighting, `@11ty/eleventy-navigation`. All additive against this base.

No git commit was made — left for you.

## Home page: coyote + coming-soon apps (2026-09-05) — complete

- [x] Rewrite `src/index.njk`: coyote hero, "Coming soon" list, contact line
- [x] Coyote as inline SVG — no JS, no image asset, no extra request
- [x] All styling added to `src/assets/css/main.css` (no inline `style=`, no `<style>`)
- [x] New tokens `--moon` / `--ink` with light + dark values
- [x] Verify: build exits 0, no unrendered `{{ }}` / `{% %}` in output
- [x] Verify: zero `<script>` / `onclick` / `javascript:` in `_site/`
- [x] Verify: rendered screenshots in light and dark mode

### Review

The coyote went through five iterations, each one rendered and looked at rather
than assumed. A full seated body silhouette never resolved — legs vanished into
the torso mass and the head read as a three-spike crown, confirmed with a
colour-coded wireframe render. Switched to a head-in-profile mark against a full
moon, which reads instantly at hero size and works as a logo later.

No JavaScript anywhere. The two app cards are a plain `ul`; the "Coming soon"
badge is CSS on a `p`. Silhouette colour comes from `--ink`, so it inverts to a
pale coyote on dark backgrounds; the eye, nostril and mouth are knocked out with
`--bg` and follow along.

Deliberately not done: per-app detail pages, an email capture form (would need a
backend), favicon/OG image. App descriptions are placeholder copy — replace them
with real positioning when the apps firm up.


## Next

- [ ] Decide the content model (app pages? blog?) and add collections
- [ ] Connect the repo to Cloudflare Pages (settings in README)
- [ ] Add favicon + social/OG image
