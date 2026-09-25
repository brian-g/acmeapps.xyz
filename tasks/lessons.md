# Lessons

Patterns and corrections worth not repeating. Reviewed at session start.

## Project: acmeapps.xyz

_No corrections recorded yet._

### Verification notes

- `curl --tls-max 1.1` proves nothing about a server's minimum TLS version.
  Modern curl/LibreSSL refuses to *offer* TLS 1.1, so the handshake fails
  client-side and looks identical to the server rejecting it. Confirm TLS floor,
  and edge settings generally, by reading the setting back from the Cloudflare
  API — not by inferring it from a failed local request.
- Check live Cloudflare state before trusting `tasks/todo.md`. The Pages project
  was already connected and deploying while the todo still listed it as pending.

### Environment notes

- Node is installed via Homebrew at `/opt/homebrew/bin`. If `node` is not found
  in a fresh shell, `export PATH="/opt/homebrew/bin:$PATH"` first.
- Headless Firefox cannot render inside the Claude Code sandbox, even with the
  sandbox disabled, and leaves hung processes that lock the profile. For page
  screenshots, compile a small WKWebView snapshot script with `swiftc`. It works
  and can force light or dark appearance.
