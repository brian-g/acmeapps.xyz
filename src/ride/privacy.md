---
layout: privacy.njk
title: Acme Ride Privacy Policy
description: How Acme Ride handles your ride, location, health, and sensor data.
updated: 2026-11-17
---

Acme Ride records your GPS route, heart rate, speed, cadence, and radar alerts during a ride. Your ride history, the routes you import, and GPX route files are stored only in Acme Ride's private storage on your device.

Acme Ride asks for When In Use access to record your route, and Always access so an in-progress recording keeps running if you lock your phone or switch apps mid-ride. GPS stays off when you aren't recording. The one exception is the New Ride sheet: if you've already allowed location access and haven't chosen a route, it takes a single location fix to show your local weather.

Acme Ride reads your heart rate, resting heart rate, and date of birth from Apple Health to calculate your personal HR zones. It reads your weight and sex to estimate the calories each ride burns. It reads your existing workouts so it doesn't save a ride that your Apple Watch or another app has already recorded. When a ride ends, Acme Ride saves it to Apple Health as a cycling workout with its distance, calories, and route map, so it appears in the Fitness app and counts toward your Activity rings. You can review or revoke this access anytime in the Health app.

Acme Ride connects over Bluetooth to the sensors you pair: heart rate strap, speed/cadence sensor, and radar (e.g. Garmin Varia). Each paired sensor's Bluetooth identifier is stored on your device so it can reconnect automatically. Sensor data is never shared with anyone else.

Acme Ride doesn't require an account or login. Your ride and location data stay on your device unless you export a GPX file, with these exceptions. Each one sends only the coordinates described, with no account or identifier attached, and none of the replies are shared with anyone:

- **Place names.** To name a ride after the town it started in, Acme Ride sends the ride's starting point to Apple's map service. A ride that follows a route is named after the route and sends nothing. Turn off Place Names in Settings to stop this.
- **Weather.** To show the weather on the New Ride sheet, Acme Ride sends your current location, or the start of the route you've chosen, to Apple's weather service. During a ride it sends your current location about every 10 minutes. While you ride a route, it also sends points along the route ahead so it can show the wind there and warn you of rain. It stops checking the route ahead while the ride is paused or the app is in the background.
- **Road surfaces.** When you import a route, Acme Ride sends the route's line to the public OpenStreetMap Overpass service (overpass-api.de) to find the surface of the roads along it. Only the planned route is sent, never a ride you've recorded.

Route descriptions are written by Apple Intelligence on your device and never leave it. Acme Ride contains no advertising, analytics, or crash reporting, and we never sell your data or share it with third parties for advertising. You can change location, Bluetooth, motion, or Health permissions anytime in iOS Settings. Deleting the app removes all ride data stored on your device. Workouts already saved to Apple Health stay there until you delete them in the Health app.

Questions about this policy? Email [{{ site.author.email }}](mailto:{{ site.author.email }}).
