---
title: Wheel size and speed accuracy
description: Set your wheel size for an accurate speed sensor, how automatic calibration works, and what happens when the sensor drops out.
category: Settings and troubleshooting
order: 150
---

Acme Ride measures speed and distance from GPS, or from a speed sensor if you've paired one. A speed sensor counts wheel turns, so Acme Ride needs your wheel's circumference to turn those into speed and distance.

## Set your wheel size

Go to **Settings → Wheel Size** and choose the size printed on your tyre's sidewall:

| Wheel Size | Circumference |
|---|---|
| 700 x 23c (default) | 2096 mm |
| 700 x 25c | 2105 mm |
| 700 x 28c | 2136 mm |
| 700 x 32c | 2155 mm |
| 700 x 35c | 2168 mm |
| 650b x 47 | 2144 mm |
| 29 x 2.1 | 2288 mm |
| 26 x 2.0 | 2051 mm |

If your size isn't listed, choose **Custom** and enter the **Circumference** in millimetres, from 1,500 to 3,000.

To measure it yourself, mark the tyre where it touches the ground, roll the bike forward one full turn in a straight line with your weight on it, and measure the distance between the marks.

Acme Ride has one wheel size for all your rides. If you swap bikes, update it before you ride.

## Automatic calibration

While you ride with a speed sensor, Acme Ride compares the sensor's distance with GPS. If they differ by more than 2% over two stretches of 1.5 km in a row, it corrects your wheel size and shows a banner, for example "Wheel size auto-adjusted to 2110 mm". Each correction is at most 10%, with no more than three per ride. Afterwards, **Wheel Size** shows **Custom** with the new value.

Calibration works best on open roads with a clear view of the sky. Tall buildings and tree cover make GPS less accurate.

## If the speed sensor drops out

If your speed sensor stops responding mid-ride, Acme Ride switches to GPS speed and shows a banner such as "Switched to GPS for speed — Speed sensor not responding". It switches back when the sensor reconnects.

## Units

Choose **Metric** or **Imperial** in **Settings → Units**. This sets speed (km/h or mph), distance (km or mi), and elevation (m or ft). The default follows your iPhone's region. Temperature follows your iPhone's region settings.
