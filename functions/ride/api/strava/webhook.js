// /ride/api/strava/webhook — Strava's push subscription callback, which Strava's
// API terms require. Nothing is stored: the app learns of a deauthorization when
// Strava refuses its next refresh.
import { jsonResponse } from "../../../../lib/strava.js";

// Subscription validation: echo hub.challenge when the verify token matches.
export function onRequestGet({ request, env }) {
  const query = new URL(request.url).searchParams;
  const challenge = query.get("hub.challenge");
  const verified =
    query.get("hub.mode") === "subscribe" &&
    !!env.STRAVA_WEBHOOK_VERIFY_TOKEN &&
    query.get("hub.verify_token") === env.STRAVA_WEBHOOK_VERIFY_TOKEN;
  if (!verified || !challenge) return jsonResponse({ error: "forbidden" }, 403);
  return jsonResponse({ "hub.challenge": challenge }, 200);
}

// Events, including deauthorizations ({"updates": {"authorized": "false"}}).
// Strava wants a 200 within two seconds and retries otherwise; the body is unread.
export function onRequestPost() {
  return new Response(null, { status: 200, headers: { "Cache-Control": "no-store" } });
}
