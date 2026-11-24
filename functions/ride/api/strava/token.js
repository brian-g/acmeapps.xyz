// POST /ride/api/strava/token  {code} → Strava's tokens for an authorization code.
import { clientCredentials, postToStrava, readField } from "../../../../lib/strava.js";

export async function onRequestPost({ request, env }) {
  const code = await readField(request, "code");
  if (code instanceof Response) return code;
  return postToStrava("token", {
    ...clientCredentials(env),
    code,
    grant_type: "authorization_code",
  });
}
