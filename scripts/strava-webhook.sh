#!/usr/bin/env bash
# Manage the Strava push subscription for the token service's webhook.
# Strava allows one per app. See docs/strava-token-service.md.
#
#   scripts/strava-webhook.sh create    # after the webhook is deployed to production
#   scripts/strava-webhook.sh view
#   scripts/strava-webhook.sh delete <id>
#
# Prompts for the client id and secret (and, for create, the verify token, which must equal
# the production STRAVA_WEBHOOK_VERIFY_TOKEN). Nothing is saved or echoed.
set -euo pipefail

API=https://www.strava.com/api/v3/push_subscriptions
CALLBACK=https://acmeapps.xyz/ride/api/strava/webhook

usage() { echo "usage: $0 create | view | delete <id>" >&2; exit 2; }
case "${1:-}" in
  create | view) [[ $# -eq 1 ]] || usage ;;
  delete) [[ $# -eq 2 ]] || usage ;;
  *) usage ;;
esac

read -r -p "Strava client id: " CID
read -r -s -p "Strava client secret: " CSECRET; echo

case "$1" in
  create)
    read -r -s -p "Webhook verify token: " VERIFY; echo
    # Strava calls the callback with hub.challenge before it answers.
    curl -sS -X POST "$API" \
      --form-string client_id="$CID" --form-string client_secret="$CSECRET" \
      --form-string callback_url="$CALLBACK" --form-string verify_token="$VERIFY"
    echo
    ;;
  view)
    curl -sS -G "$API" --data-urlencode client_id="$CID" --data-urlencode client_secret="$CSECRET"
    echo
    ;;
  delete)
    curl -sS -o /dev/null -w "HTTP %{http_code} (204 = deleted)\n" -X DELETE -G "$API/$2" \
      --data-urlencode client_id="$CID" --data-urlencode client_secret="$CSECRET"
    ;;
esac
