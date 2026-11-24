# Strava token service

Acme Ride connects to Strava with OAuth. Exchanging a code, refreshing and revoking all need the app's
`client_secret`, which can't ship in the app, and Strava's API terms require a deauthorization webhook. This service
does both. It runs as Cloudflare Pages Functions alongside the site, at `https://acmeapps.xyz/ride/api/strava/`.

It is stateless: it adds the client credentials, forwards to Strava and returns Strava's answer. It stores nothing and
logs no code, token or request body. A failed call logs only `strava <endpoint>: <status>`.

| File | |
| --- | --- |
| `functions/ride/api/strava/*.js` | One file per endpoint |
| `lib/strava.js` | Shared forwarding code (outside `functions/`, so it is never a route) |
| `test/strava.test.js` | `npm test`. Fakes Strava; no network or secrets |

Pages builds `functions/` itself and routes only `/ride/api/strava/*` to it. Every other path stays static.

## Endpoints

All responses carry `Cache-Control: no-store`. Request bodies are JSON. A body that isn't JSON or lacks the field
gets `400 {"error": "…"}` and Strava is not called. If Strava can't be reached the answer is `502`. Otherwise
Strava's status, body and content type come back unchanged.

| Endpoint | Body | Forwards to Strava |
| --- | --- | --- |
| `POST token` | `{"code": "…"}` | `POST /oauth/token`, `grant_type=authorization_code` |
| `POST refresh` | `{"refresh_token": "…"}` | `POST /oauth/token`, `grant_type=refresh_token` |
| `POST revoke` | `{"token": "…"}` | `POST /oauth/revoke`, HTTP Basic (client id:secret). `200` with no body, found or not |
| `GET webhook` | — | Subscription validation: `200 {"hub.challenge": …}` when `hub.mode=subscribe` and `hub.verify_token` matches, else `403` |
| `POST webhook` | Strava event | Nothing. Always `200` (Strava wants it within 2 s) |

- **Refresh** rotates the refresh token: the old one stops working as soon as Strava returns a new one, so the app
  saves the new one before using the new access token. While the access token has more than an hour left, Strava
  returns the same tokens unchanged.
- **Revoke:** revoking either token revokes the other. Strava retires the older `oauth/deauthorize` on 2027-06-01.
- **Webhook:** a deauthorization event has `"updates": {"authorized": "false"}`. The service doesn't act on it. The
  app learns of it when Strava refuses its next refresh.

## Configuration

Set in Cloudflare → Workers & Pages → the `acmeapps.xyz` project → Settings → Variables and Secrets, for **both**
Production and Preview:

| Name | Type | Value |
| --- | --- | --- |
| `STRAVA_CLIENT_ID` | Text | The client id from strava.com/settings/api |
| `STRAVA_CLIENT_SECRET` | Secret | The client secret from strava.com/settings/api |
| `STRAVA_WEBHOOK_VERIFY_TOKEN` | Secret | A random string you choose (`openssl rand -hex 32`), used only when creating the webhook subscription |

A change takes effect on the **next deployment**. Retry the latest deployment or push a commit. Never commit a value.
For `wrangler pages dev`, put them in `.dev.vars` (gitignored).

Strava's API settings: **Authorization Callback Domain** exactly `acmeapps.xyz`. Strava doesn't trim it, so a stray
space rejects every redirect with `redirect_uri invalid`. Strava matches on the redirect's host, so the app's
`cyclometer://acmeapps.xyz/strava` and any `https://acmeapps.xyz/…` page pass (subdomains too). `localhost` is
always allowed.

**Rate limiting.** One WAF rule (Security → WAF → Rate limiting rules): when *URI Path* starts with
`/ride/api/strava/`, counted per IP, more than 20 requests in 10 seconds → Block for 10 seconds. A rider's app makes
a handful of calls an hour. Strava's webhook calls come from Strava's servers and are a few per deauthorization. Cloudflare counts
approximately across its edge, so the block can start a few requests past 20 (the 2026-11-24 check blocked the
30th).

## Deploying

Merge to `main`: Pages builds the site and the Functions together. A branch push makes a preview deployment
(`<branch>.<project>.pages.dev`) that uses the Preview variables.

Local run with the real runtime:

```sh
npm run build
npx wrangler pages dev _site      # http://localhost:8788, reads .dev.vars
```

## Webhook subscription (once per Strava app)

Strava allows one subscription per app. Create it after the webhook is deployed to production: Strava validates the
callback at once, from its own servers. `scripts/strava-webhook.sh` prompts for the client id and secret (and, for
create, the verify token) and saves or echoes none of them:

```sh
scripts/strava-webhook.sh create        # answers {"id": …}
scripts/strava-webhook.sh view
scripts/strava-webhook.sh delete <id>   # 204; needed before changing the callback URL
```

The verify token must equal the production `STRAVA_WEBHOOK_VERIFY_TOKEN`. To change it, delete the subscription,
update the variable, redeploy, and create it again.

**Checking the live site from a network with an ISP filter.** Some ISP filters (Spectrum's Security Shield, run by
CUJO) block `acmeapps.xyz`: `curl` fails with `tlsv1 alert protocol version` or `wrong version number`, and
`curl http://acmeapps.xyz:443/` answers with a redirect to `block.charter-prod.hosted.cujo.io`. Safari may still load
it through iCloud Private Relay. Test the production deployment at `acmeapps-xyz.pages.dev` instead, or check the
custom domain from outside with check-host.net.

## Rotating the secret

strava.com/settings/api has **Generate New Client Secret** beside the secret's **Show**.

1. Click **Generate New Client Secret**.
2. Update `STRAVA_CLIENT_SECRET` in Cloudflare (Production and Preview) and retry the latest deployment.
3. Check: `scripts/strava-webhook.sh view` with the new secret lists the subscription, and a `token` call with a bogus
   code answers `code invalid` (not `client_id invalid`).

Between steps 1 and 2 every exchange, refresh and revoke fails, so do them back to back. The app keeps its tokens and
retries. Unverified: Strava's docs don't say whether tokens issued before a new secret keep working. The webhook
subscription is tied to the client id, so it should survive.

## Manual end-to-end check

Use a preview or production deployment with the variables set (`$BASE` is its `/ride/api/strava` URL):

1. Open
   `https://www.strava.com/oauth/authorize?client_id=<id>&response_type=code&redirect_uri=https://acmeapps.xyz/ride/&scope=read&approval_prompt=force`
   with `open '<url>'` rather than copying it out of a terminal, because a wrapped line copies with a line break,
   which breaks the URL. Approve it, then copy `code` from the address bar of the Acme Ride page you land on.
2. `curl -X POST $BASE/token -H 'Content-Type: application/json' -d '{"code":"<code>"}'`: tokens and athlete.
3. `curl -X POST $BASE/refresh -H 'Content-Type: application/json' -d '{"refresh_token":"<refresh>"}'`: new tokens.
4. `curl -i -X POST $BASE/revoke -H 'Content-Type: application/json' -d '{"token":"<refresh>"}'`: `200`, no body.
5. Repeat step 3: Strava refuses (`400`), passed through.
