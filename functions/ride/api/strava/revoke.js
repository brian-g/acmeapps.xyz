// POST /ride/api/strava/revoke  {token} → Strava's oauth/revoke. The token may be an
// access or refresh token; revoking either revokes the other. Strava answers 200
// with no body, found or not. oauth/deauthorize is retired on 2027-06-01.
import { basicAuth, postToStrava, readField } from "../../../../lib/strava.js";

export async function onRequestPost({ request, env }) {
  const token = await readField(request, "token");
  if (token instanceof Response) return token;
  return postToStrava("revoke", { token }, basicAuth(env));
}
