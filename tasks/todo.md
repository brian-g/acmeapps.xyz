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


## Cloudflare setup audit (2026-09-05) — partial

Audited the live zone and Pages project rather than assuming the README matched
reality. The Pages project already existed and had deployed `main` twice
successfully; the gaps were in the zone around it.

- [x] `www.acmeapps.xyz` — was a proxied CNAME to `parkingpage.namecheap.com`
      left over from the registrar, serving **HTTP 525**. Retargeted to
      `acmeapps-xyz.pages.dev` and added a dynamic redirect rule
      (`http.host eq "www.acmeapps.xyz"` → 301 to the apex, query preserved)
- [x] Turned off Cloudflare's managed `robots.txt`, which was prepending ~1.8 KB
      of AI-crawler `Disallow` rules and `ai-train=no` ahead of our own file
- [x] Pages build command `npx @11ty/eleventy` → `npm run build`, matching README
- [x] Verify: `www` 301s to apex with path and query intact; apex still 200 with
      `_headers` applied; assets still `immutable`; unknown paths still 404;
      `robots.txt` back to its own 23 bytes
- [ ] **Blocked** — zone TLS settings. `min_tls_version` is still `1.0`,
      `always_use_https` is `off`, and SSL mode is `Full` rather than
      `Full (strict)`. `PATCH /zones/{zone}/settings/{id}` was refused by the
      local permission classifier; needs either a Bash permission rule or a
      change in the dashboard under SSL/TLS → Edge Certificates
- [x] Added a DMARC record: `_dmarc` TXT
      `v=DMARC1; p=none; rua=mailto:hello@acmeapps.xyz; fo=1`. Monitoring only —
      `p=none` enforces nothing, so it cannot affect delivery of the existing
      Namecheap forwarding. Aggregate reports go to the domain's own address, so
      no external authorisation record is needed. Verified resolving via both
      Cloudflare and Google DNS, with SPF and all five MX records intact.

HSTS was deliberately left off.

## Next

- [ ] Decide the content model (app pages? blog?) and add collections
- [ ] Add favicon + social/OG image

## Modernize home page (2026-09-24) — complete

- [x] Hero: full-bleed coyote photo (Unsplash, Joshua Wilking) with overlay text;
      WebP + JPEG at 1200/2400w via `<picture>`, credit in footer
- [x] Layout: widen `--wrap` 42rem → ~72rem; keep prose pages at a readable measure
- [x] Apps grid: `auto-fill, minmax(18rem, 1fr)` → 1/2/3 columns by width
- [x] Fix invalid markup: `<a>` directly inside `<ul>` around Cyclometer card
- [x] Icons: Cyclometer (its favicon.svg), DockClockX (BlackClock512.png → WebP),
      new RADAR.speed SVG icon
- [x] Move SVG coyote-moon mark into the header as the logo
- [x] Verify: build, markup check, Firefox screenshots at desktop/tablet/phone, light+dark

### Review

- `.page` is now a named-column grid (`full` / `content`), so the hero bleeds
  edge to edge without `100vw` overflow tricks; running text in plain pages is
  still capped at `--measure` (42rem).
- Hero is WebP only (1200w 87 KB, 2400w 235 KB), from the 6000px original.
  Every current browser supports WebP, so no JPEG fallback was kept.
- Only Cyclometer links out, so only its card is clickable as a whole
  (stretched `::after`) and lifts on hover.
- Fixed copy typos while moving markup: "spped", "let's", "NeXTStep",
  "have nice visual clock".
- Screenshots: headless Firefox fails in the sandbox (no framebuffer), so a
  small WKWebView snapshot script (in the scratchpad, not the repo) captured
  1440/820/390 widths in light and dark.
