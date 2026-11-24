// Strava token service (functions/ride/api/strava/). Strava is faked by stubbing
// global fetch, so no network and no secrets are needed.
import { afterEach, beforeEach, describe, mock, test } from "node:test";
import assert from "node:assert/strict";

import * as token from "../functions/ride/api/strava/token.js";
import * as refresh from "../functions/ride/api/strava/refresh.js";
import * as revoke from "../functions/ride/api/strava/revoke.js";
import * as webhook from "../functions/ride/api/strava/webhook.js";

const env = {
  STRAVA_CLIENT_ID: "123",
  STRAVA_CLIENT_SECRET: "shh",
  STRAVA_WEBHOOK_VERIFY_TOKEN: "verify-me",
};

const BASE = "https://acmeapps.xyz/ride/api/strava/";

function post(path, body) {
  return new Request(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

/// Stubs fetch with one canned Strava answer and records each call.
function fakeStrava(status, body, contentType = "application/json") {
  const calls = [];
  mock.method(globalThis, "fetch", async (url, init) => {
    calls.push({ url, init, form: Object.fromEntries(init.body) });
    const headers = contentType ? { "Content-Type": contentType } : {};
    return new Response(body, { status, headers });
  });
  return calls;
}

beforeEach(() => mock.method(console, "error", () => {}));
afterEach(() => mock.restoreAll());

describe("token", () => {
  test("exchanges the code with the client credentials", async () => {
    const calls = fakeStrava(200, '{"access_token":"a","refresh_token":"r"}');
    const res = await token.onRequestPost({ request: post("token", { code: "c0de" }), env });

    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://www.strava.com/oauth/token");
    assert.equal(calls[0].init.method, "POST");
    assert.equal(calls[0].init.headers["Content-Type"], "application/x-www-form-urlencoded");
    assert.deepEqual(calls[0].form, {
      client_id: "123",
      client_secret: "shh",
      code: "c0de",
      grant_type: "authorization_code",
    });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("Cache-Control"), "no-store");
    assert.equal(res.headers.get("Content-Type"), "application/json");
    assert.equal(await res.text(), '{"access_token":"a","refresh_token":"r"}');
  });

  test("passes Strava's refusal through", async () => {
    fakeStrava(400, '{"message":"Bad Request","errors":[{"field":"code","code":"invalid"}]}');
    const res = await token.onRequestPost({ request: post("token", { code: "used" }), env });
    assert.equal(res.status, 400);
    assert.match(await res.text(), /"field":"code"/);
  });

  test("400 without a code, and Strava is never asked", async () => {
    const calls = fakeStrava(200, "{}");
    for (const body of [{}, { code: "" }, { code: 42 }, "not json"]) {
      const res = await token.onRequestPost({ request: post("token", body), env });
      assert.equal(res.status, 400, JSON.stringify(body));
    }
    assert.equal(calls.length, 0);
  });

  test("502 when Strava can't be reached", async () => {
    mock.method(globalThis, "fetch", async () => {
      throw new TypeError("network down");
    });
    const res = await token.onRequestPost({ request: post("token", { code: "c" }), env });
    assert.equal(res.status, 502);
  });

  test("logs no code or token", async () => {
    const log = mock.method(console, "error", () => {});
    fakeStrava(401, '{"message":"Authorization Error"}');
    await token.onRequestPost({ request: post("token", { code: "secret-code" }), env });
    const logged = log.mock.calls.map((c) => c.arguments.join(" ")).join("\n");
    assert.doesNotMatch(logged, /secret-code|shh/);
  });
});

describe("refresh", () => {
  test("refreshes with the client credentials", async () => {
    const calls = fakeStrava(200, '{"access_token":"a2","refresh_token":"r2"}');
    const res = await refresh.onRequestPost({ request: post("refresh", { refresh_token: "r1" }), env });

    assert.equal(calls[0].url, "https://www.strava.com/oauth/token");
    assert.deepEqual(calls[0].form, {
      client_id: "123",
      client_secret: "shh",
      refresh_token: "r1",
      grant_type: "refresh_token",
    });
    assert.equal(res.status, 200);
    assert.equal(await res.text(), '{"access_token":"a2","refresh_token":"r2"}');
  });

  test("400 without a refresh_token", async () => {
    const calls = fakeStrava(200, "{}");
    const res = await refresh.onRequestPost({ request: post("refresh", { token: "r1" }), env });
    assert.equal(res.status, 400);
    assert.equal(calls.length, 0);
  });
});

describe("revoke", () => {
  test("revokes with Basic auth and only the token in the form", async () => {
    const calls = fakeStrava(200, null, null);
    const res = await revoke.onRequestPost({ request: post("revoke", { token: "r1" }), env });

    assert.equal(calls[0].url, "https://www.strava.com/oauth/revoke");
    assert.equal(calls[0].init.headers.Authorization, "Basic " + btoa("123:shh"));
    assert.deepEqual(calls[0].form, { token: "r1" });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("Content-Type"), null);
    assert.equal(await res.text(), "");
  });

  test("400 without a token", async () => {
    const calls = fakeStrava(200, null, null);
    const res = await revoke.onRequestPost({ request: post("revoke", {}), env });
    assert.equal(res.status, 400);
    assert.equal(calls.length, 0);
  });
});

describe("webhook", () => {
  function validation(params) {
    const url = new URL(BASE + "webhook");
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    return new Request(url);
  }

  test("echoes the challenge when the verify token matches", async () => {
    const res = webhook.onRequestGet({
      request: validation({ "hub.mode": "subscribe", "hub.challenge": "15f7d1a91c1f40f8a748fd134752feb3", "hub.verify_token": "verify-me" }),
      env,
    });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("Content-Type"), "application/json");
    assert.deepEqual(await res.json(), { "hub.challenge": "15f7d1a91c1f40f8a748fd134752feb3" });
  });

  test("403 for a wrong token, a wrong mode, a missing challenge or no configured token", async () => {
    const good = { "hub.mode": "subscribe", "hub.challenge": "x", "hub.verify_token": "verify-me" };
    const cases = [
      [{ ...good, "hub.verify_token": "nope" }, env],
      [{ ...good, "hub.mode": "unsubscribe" }, env],
      [{ "hub.mode": "subscribe", "hub.verify_token": "verify-me" }, env],
      [{ ...good, "hub.verify_token": "" }, { ...env, STRAVA_WEBHOOK_VERIFY_TOKEN: "" }],
    ];
    for (const [params, e] of cases) {
      const res = webhook.onRequestGet({ request: validation(params), env: e });
      assert.equal(res.status, 403, JSON.stringify(params));
    }
  });

  test("acknowledges a deauthorization with a 200 and stores nothing", async () => {
    const calls = fakeStrava(200, "{}");
    const event = {
      aspect_type: "update",
      event_time: 1516126040,
      object_id: 1234567,
      object_type: "athlete",
      owner_id: 1234567,
      subscription_id: 120475,
      updates: { authorized: "false" },
    };
    const res = webhook.onRequestPost({ request: post("webhook", event), env });
    assert.equal(res.status, 200);
    assert.equal(calls.length, 0);
  });
});
