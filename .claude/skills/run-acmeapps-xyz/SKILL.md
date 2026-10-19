---
name: run-acmeapps-xyz
description: Build, run, and screenshot the acmeapps.xyz Eleventy site. Use when asked to start the site or dev server, build it, check pages render, take a screenshot of a page (phone, desktop, light or dark), or confirm a CSS/template change works in the browser.
---

Static Eleventy 3 site on macOS. Start the dev server, then drive it with
`.claude/skills/run-acmeapps-xyz/smoke.sh` (route checks + screenshots) or the
`snap.swift` WKWebView tool it compiles. All paths are relative to the repo root.

## Prerequisites

Homebrew Node (v26 here; `.node-version` pins 22.16.0 for Cloudflare only) and
Xcode command line tools for `swiftc`. No Chromium/Playwright on this machine.

```bash
export PATH="/opt/homebrew/bin:$PATH"   # node is not on PATH in a fresh shell
npm install                              # once
```

## Build

```bash
npm run build    # -> _site/, ~0.1s
```

## Run (agent path)

Start the dev server in the background (Bash `run_in_background`), wait for it,
then smoke it:

```bash
npm start        # eleventy --serve, live reload at http://localhost:8080
until curl -sf http://localhost:8080 >/dev/null; do sleep 1; done
.claude/skills/run-acmeapps-xyz/smoke.sh
```

`smoke.sh` checks every route (200s, 404 for an unknown path), compiles
`snap.swift` to `$TMPDIR/acmeapps-tools/snap` on first run, then screenshots
home/about/ride/radar at 390x844 and 1280x900, plus ride in dark mode, into
`$TMPDIR/acmeapps-shots/`. Exits non-zero on any failure. **Read the PNGs** -
a 200 doesn't mean the layout is right. Pass a directory to write elsewhere.

One-off shots, after `smoke.sh` has compiled the binary:

```bash
S=$TMPDIR/acmeapps-tools/snap
# usage: snap <url> <width> <height> <out.png> [light|dark] [js-before-snapshot]
$S http://localhost:8080/ride/ 390 844 $TMPDIR/ride.png
$S http://localhost:8080/ride/ 390 844 $TMPDIR/ride-dark.png dark
$S http://localhost:8080/ride/ 390 844 $TMPDIR/ride-scrolled.png light 'scrollTo({top: 700, behavior: "instant"})'
```

Shots are 2x (390 wide -> 780px PNG). Uncaught page errors print as
`js error: ...` before `wrote ...`.

Stop the server: `lsof -ti:8080 -sTCP:LISTEN | xargs kill`

## Test

No test suite. `smoke.sh` plus looking at the screenshots is the check.

## Gotchas

- **Headless Firefox doesn't work in the Claude Code sandbox** (even unsandboxed)
  and leaves hung processes that lock its profile. That's why the driver is WKWebView.
- **`backdrop-filter` isn't rendered by WKWebView snapshots.** Content under the
  frosted header looks crisp even on correct CSS. Don't call it a regression.
- **`scroll-behavior: smooth`** (main.css) turns `scrollTo(0, y)` into a no-op
  for a snapshot - pass `{behavior: "instant"}`. snap waits 0.5s after the JS
  arg because scroll-driven styles lag a frame.
- **Don't put the snap binary directly in `$TMPDIR`.** WebKit writes caches to
  `$TMPDIR/<executable-name>/WebKit/`; a file at that path makes every run spew
  `could not create directory ... Not a directory`. smoke.sh uses a subdirectory.

## Troubleshooting

- **`node: command not found` / `npm: command not found`**: fresh shell without
  Homebrew on PATH. `export PATH="/opt/homebrew/bin:$PATH"`.
- **`timeout: command not found`**: macOS has no GNU `timeout`. Use the bare
  `until curl ...` loop above.
- **`child setpgid (...): Operation not permitted`** from bash after a snap run:
  sandbox noise, the screenshot still writes. Ignore.
