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
a handful of calls an hour. Strava's webhook calls come from Strava's servers and are a few per deauthorization.

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
callback at once. Run these in a shell, entering values at the prompts:

```sh
read -p "client id: " CID; read -s -p "client secret: " CSECRET; echo; read -s -p "verify token: " VERIFY; echo

# Create. Answers {"id": …}
curl -X POST https://www.strava.com/api/v3/push_subscriptions \
  -F client_id="$CID" -F client_secret="$CSECRET" \
  -F callback_url=https://acmeapps.xyz/ride/api/strava/webhook -F verify_token="$VERIFY"

# View
curl -G https://www.strava.com/api/v3/push_subscriptions -d client_id="$CID" -d client_secret="$CSECRET"

# Delete (204). Needed before changing the callback URL
curl -X DELETE "https://www.strava.com/api/v3/push_subscriptions/<id>?client_id=$CID&client_secret=$CSECRET"
```

`VERIFY` must equal the production `STRAVA_WEBHOOK_VERIFY_TOKEN`. To change the verify token, delete the subscription,
update the variable, redeploy, and create it again.

## Rotating the secret

Strava's docs don't describe regenerating a client secret or what happens to issued tokens when it changes.
Unverified. If strava.com/settings/api offers a regenerate control:

1. Regenerate the secret in Strava's settings.
2. Update `STRAVA_CLIENT_SECRET` in Cloudflare (Production and Preview) and retry the latest deployment.
3. Check: a `refresh` with a live refresh token answers `200`.

Between steps 1 and 2 every exchange, refresh and revoke fails. The app keeps its tokens and retries, so do the two
steps back to back. If Strava's settings offer no regenerate control, ask Strava developer support. The webhook
subscription is tied to the client id, not the secret.

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
