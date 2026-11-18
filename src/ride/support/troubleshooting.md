---
title: Troubleshooting
description: Fixes for sensors that won't connect, missing turn tones, rides missing from Apple Health, import errors, and more.
category: Settings and troubleshooting
order: 160
---

## Sensors

### My sensor doesn't appear in Manage Sensors

- Wake the sensor: spin the wheel or crank, moisten and put on the heart rate strap, or switch on the radar.
- Bring it close to your iPhone and pull down on the list to search again.
- Close other cycling apps, and disconnect bike computers or watches that may be connected to it. Many sensors accept only one connection at a time.
- Check that Bluetooth is on, and that Acme Ride is allowed to use it in **iOS Settings → Acme Ride**.
- Make sure the sensor is supported. Power meters, ANT+ only sensors, and the Garmin Varia RearVue 820 aren't. See [Pair a sensor](/ride/support/pair-a-sensor/).

### My sensor keeps disconnecting

If the ride summary says "Unreliable connection — check battery or mount", the sensor dropped out at least five times within five minutes. Replace its battery, check that it's mounted firmly, and keep your iPhone on the handlebars rather than in a back pocket if you can.

### The Cadence widget is missing from Add Widget

It appears only after you pair a cadence sensor, or a combined sensor set to **Cadence** or **Both**.

### My speed or distance looks wrong

Check your wheel size in Settings. See [Wheel size and speed accuracy](/ride/support/wheel-size-and-speed/).

## Routes and navigation

### A route won't import

The error message tells you why. See the table of import errors in [Load a route](/ride/support/load-a-route/). Acme Ride imports GPX files only, up to 16 MB and 100,000 points.

### I'm not getting turn alerts

- Check that **Turn-by-Turn** was on in the **New Ride** sheet.
- Turn alerts come from the cues in your GPX file. Export the route again with cue sheets or turn instructions turned on.

### I see the turn banner but don't hear the tone

The turn tone is held back while a radar warning is sounding, so the two don't overlap. Also check your iPhone's volume.

### There's no written description for my route

Route descriptions need Apple Intelligence to be turned on and finished downloading, and a route that includes elevation data.

## Apple Health

### My ride isn't in Apple Health

- If your Apple Watch or another app recorded the same ride, Acme Ride doesn't save a duplicate. Look for that workout instead.
- Check that Acme Ride can save workouts: in the **Health** app, tap your profile picture, then **Apps → Acme Ride**. Once you allow it, Acme Ride saves the rides it was holding.
- Open Acme Ride again. It retries any ride it couldn't save.

### My ride in Health has no calories

Acme Ride needs your weight to save calories. Add it in the Health app. See [Heart rate zones and calories](/ride/support/heart-rate-zones/).

### My heart rate zones look wrong

Enter your resting and maximum heart rate in **Settings → HR Zones**. See [Heart rate zones and calories](/ride/support/heart-rate-zones/).

## Recording

### My ride stopped recording when I locked my phone

Acme Ride records with the screen locked, but it needs location access. Check that **iOS Settings → Acme Ride → Location** is set to **While Using the App**, not **Never** or **Ask Next Time**.

### The app closed during my ride

Open Acme Ride again. It resumes the ride where it left off. Progress is saved every 30 seconds. See [Record a ride](/ride/support/record-a-ride/).

### I see "History Unavailable" or "Ride Tracks Unavailable"

Acme Ride couldn't open its saved data. Restart your iPhone and open the app again. If the message is still there, tap **Reset Ride History…** or **Reset Ride Tracks…** to start fresh. Acme Ride keeps a copy of the old data rather than deleting it. Email us before resetting if you'd like help recovering it.

## Contacting support

When you email us, include your iPhone model, iOS version, and what happened, plus the make and model of any sensor involved.
