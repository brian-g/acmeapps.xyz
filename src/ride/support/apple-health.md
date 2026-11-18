---
title: How Acme Ride uses Apple Health data
description: What Acme Ride reads from Apple Health and why, what it saves there after each ride, and how to change or revoke access.
category: Your data
order: 110
---

Acme Ride uses Apple Health in two ways. It reads a little about you to set your heart rate zones and estimate calories, and it saves each finished ride as a workout. Health data stays on your iPhone, and Acme Ride never sends it anywhere else.

Health access is optional. Acme Ride asks during setup, and you can change your choices at any time.

## What Acme Ride reads

| Data | Why |
|---|---|
| **Date of birth** | Estimates your maximum heart rate (220 minus your age) for your heart rate zones. |
| **Resting heart rate** | Sets your heart rate zones. Only readings from the last 30 days are used. |
| **Heart rate zones** | Uses the zones you've set in Health, when available, so they match your other fitness apps. |
| **Heart rate** | Fills in from your Apple Watch if your heart rate strap drops out mid-ride. |
| **Weight** and **sex** | Estimates the calories each ride burns. |
| **Workouts** | Checks whether another app or your Apple Watch has already saved the same ride, so it isn't saved twice. |

How these become your zones and calories is explained in [Heart rate zones and calories](/ride/support/heart-rate-zones/).

## What Acme Ride saves

When you finish a ride, Acme Ride saves it to Apple Health as an **Outdoor Cycling** workout with:

- **Cycling distance**,
- **Active energy** (calories), if your weight is in Health,
- **Workout route**, the map of where you rode.

The workout appears in the Fitness app and counts toward your Activity rings. Acme Ride doesn't write individual heart rate readings to Health.

Each item is saved only if you've allowed it. For example, if you allow workouts but not routes, the workout is saved without its map.

### Rides already recorded elsewhere

If your Apple Watch or another app has already saved a cycling workout covering the same time, Acme Ride doesn't save a second one. Your ride is still in Acme Ride's history.

### If a ride doesn't appear in Health

If workout sharing is turned off, Acme Ride holds your rides and saves them once you allow it. If saving fails for another reason, it tries again the next time you open the app. See also [Troubleshooting](/ride/support/troubleshooting/).

## Deleting rides

When you delete a ride in Acme Ride, its workout, route, distance, and calories are deleted from Apple Health too. Deleting the Acme Ride app doesn't remove workouts it already saved. Delete those in the Health app.

## Change or revoke access

Acme Ride has no Health switch of its own. Manage access in iOS:

1. Open the **Health** app and tap your profile picture.
2. Tap **Apps** under Privacy, then **Acme Ride**.
3. Turn individual types of data on or off.

You can also get there from **iOS Settings → Privacy & Security → Health → Acme Ride**.

Without Health access, Acme Ride still records rides. Heart rate zones use default values unless you enter your own in Settings, and rides aren't saved to Health.

The full details are in the [Acme Ride Privacy Policy](/ride/privacy/).
