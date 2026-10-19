#!/usr/bin/env bash
# Smoke-test the running dev server: route status codes, then phone + desktop
# screenshots of every page. Run from the repo root with `npm start` already up.
# usage: smoke.sh [out-dir]   (default: $TMPDIR/acmeapps-shots)
set -u
export PATH="/opt/homebrew/bin:$PATH"

base=http://localhost:8080
here=$(cd "$(dirname "$0")" && pwd)
tmp=${TMPDIR:-/tmp}; tmp=${tmp%/}
out=${1:-$tmp/acmeapps-shots}
# WebKit caches under $TMPDIR/<executable-name>/, so the binary must not sit
# directly in $TMPDIR or that path collides with the file itself.
bin=$tmp/acmeapps-tools/snap
mkdir -p "${bin%/*}"
mkdir -p "$out"

curl -sf "$base/" >/dev/null || { echo "dev server not up at $base - run npm start first"; exit 1; }

fail=0
check() {
  local code; code=$(curl -s -o /dev/null -w '%{http_code}' "$base$1")
  printf '%s %s\n' "$code" "$1"
  [ "$code" = "$2" ] || fail=1
}
for p in / /about/ /ride/ /ride/privacy/ /radar/ /radar/privacy/; do check "$p" 200; done
check /no-such-page/ 404

if [ ! -x "$bin" ] || [ "$here/snap.swift" -nt "$bin" ]; then
  swiftc -O "$here/snap.swift" -o "$bin" || exit 1
fi

for p in home:/ about:/about/ ride:/ride/ radar:/radar/; do
  name=${p%%:*} path=${p#*:}
  "$bin" "$base$path" 390 844 "$out/$name-mobile.png" || fail=1
  "$bin" "$base$path" 1280 900 "$out/$name-desktop.png" || fail=1
done
"$bin" "$base/ride/" 390 844 "$out/ride-mobile-dark.png" dark || fail=1

[ $fail = 0 ] && echo "smoke OK - screenshots in $out" || echo "smoke FAILED"
exit $fail
