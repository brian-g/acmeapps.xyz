// Shared by the Strava token service's Pages Functions (functions/ride/api/strava/).
// It lives outside functions/ so Pages never routes it.
//
// The service is stateless: it adds the client secret, forwards to Strava and
// returns Strava's answer. Never log a request or response body — they carry
// authorization codes and tokens.

const STRAVA_OAUTH = "https://www.strava.com/oauth/";

const NO_STORE = { "Cache-Control": "no-store" };

export function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...NO_STORE, "Content-Type": "application/json" },
  });
}

/// Reads one non-empty string field from a JSON request body. Returns the value,
/// or a 400 Response when the body isn't JSON or the field is missing.
export async function readField(request, name) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "body must be JSON" }, 400);
  }
  const value = body?.[name];
  if (typeof value !== "string" || value === "") {
    return jsonResponse({ error: `missing ${name}` }, 400);
  }
  return value;
}

/// POSTs a form to https://www.strava.com/oauth/<path> and returns Strava's
/// status, body and content type unchanged (revoke answers 200 with no body).
/// A Strava that can't be reached is a 502.
export async function postToStrava(path, form, headers = {}) {
  let upstream;
  try {
    upstream = await fetch(STRAVA_OAUTH + path, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(form),
    });
  } catch {
    console.error(`strava ${path}: unreachable`);
    return jsonResponse({ error: "strava unreachable" }, 502);
  }
  if (!upstream.ok) console.error(`strava ${path}: ${upstream.status}`);
  const out = new Headers(NO_STORE);
  const type = upstream.headers.get("Content-Type");
  if (type) out.set("Content-Type", type);
  return new Response(await upstream.arrayBuffer(), { status: upstream.status, headers: out });
}

/// The client id and secret as form fields, for oauth/token.
export function clientCredentials(env) {
  return { client_id: env.STRAVA_CLIENT_ID, client_secret: env.STRAVA_CLIENT_SECRET };
}

/// The client id and secret as an HTTP Basic header, for oauth/revoke.
export function basicAuth(env) {
  return { Authorization: "Basic " + btoa(`${env.STRAVA_CLIENT_ID}:${env.STRAVA_CLIENT_SECRET}`) };
}
