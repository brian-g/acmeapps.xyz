---
title: How Acme Ride uses your location
description: When Acme Ride uses GPS, why it needs only While Using the App access, and exactly which location data leaves your iPhone.
category: Your data
order: 120
---

Acme Ride uses your location to record your ride: your route, speed, and distance. Recorded rides stay on your iPhone. Acme Ride has no account, no server of its own, and no analytics.

## The permission Acme Ride asks for

Acme Ride asks for **While Using the App** location access. It never asks for **Always**.

That's enough to record a whole ride with your iPhone locked or while you use another app. iOS treats a ride in progress as using the app, and shows the location indicator in the status bar while you record.

GPS is on only while you're recording a ride. Outside a ride, Acme Ride reads your location once in two places:

- the **New Ride** sheet, to show the weather where you are,
- the **Routes** map, to centre it on you.

## What leaves your iPhone

Acme Ride sends location data in only these cases. Each request carries only the coordinates described, with no account or identifier attached.

| What's sent | Sent to | When | Purpose |
|---|---|---|---|
| Your current location | Apple Weather | When you open the **New Ride** sheet without a route | Current weather where you are |
| The start of a route | Apple Weather | On the **New Ride** sheet and a route's details | Weather at the route's start |
| Your current location | Apple Weather | About every 10 minutes during a ride | Weather and wind as you ride |
| Points on the route ahead | Apple Weather | While riding a route, with the dashboard open | Wind along the route and rain warnings |
| Your ride's starting point | Apple Maps | When you finish a ride that didn't follow a route, if **Place Names** is on | Naming the ride after the town you started in |
| An imported route's line | OpenStreetMap Overpass (overpass-api.de) | Once, after you import a route | Finding the road surfaces along the route |

A ride you've recorded is never sent to OpenStreetMap, only routes you import. Route descriptions written by Apple Intelligence are created on your iPhone and never leave it.

## Turn off place names

Go to **Settings** in Acme Ride and turn off **Place Names**. Rides are then named only by time of day and shape, such as "Morning Loop", and no starting point is sent to Apple Maps.

## Change location access

Go to **iOS Settings → Acme Ride → Location**. Acme Ride needs **While Using the App** to record rides. With location turned off, it can't record your route, speed, or distance, and it can't show the weather.

## Sharing your rides

Your rides leave your iPhone only when you choose to share them, by sharing a GPX file or saving the ride to Apple Health. See [Ride history and GPX export](/ride/support/ride-history-and-export/) and [How Acme Ride uses Apple Health data](/ride/support/apple-health/).

The full details are in the [Acme Ride Privacy Policy](/ride/privacy/).
