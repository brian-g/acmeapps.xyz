// POST /ride/api/strava/refresh  {refresh_token} → new tokens. Strava rotates the
// refresh token: the old one stops working as soon as a new one is returned.
import { clientCredentials, postToStrava, readField } from "../../../../lib/strava.js";

export async function onRequestPost({ request, env }) {
  const refreshToken = await readField(request, "refresh_token");
  if (refreshToken instanceof Response) return refreshToken;
  return postToStrava("token", {
    ...clientCredentials(env),
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
}
