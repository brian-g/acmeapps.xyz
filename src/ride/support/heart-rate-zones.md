---
title: Heart rate zones and calories
description: How Acme Ride works out your heart rate zones, how to set your own, cadence zones, and how calories are estimated.
category: Settings and troubleshooting
order: 140
---

Acme Ride shows which heart rate zone you're in during a ride and how long you spent in each zone afterwards. It works out your zones automatically, and you can fine-tune them in **Settings → HR Zones**.

## How your zones are set

Acme Ride uses the first of these that's available:

1. **Zones you've adjusted** in Settings.
2. **Zones from Apple Health**, if you've set heart rate zones there and haven't entered your own resting or maximum heart rate in Acme Ride.
3. **Calculated zones** from your resting and maximum heart rate.

Calculated zones use the Karvonen method, which bases each zone on your heart rate reserve: the gap between your resting and maximum heart rate.

| Zone | Name | Share of heart rate reserve |
|---|---|---|
| 1 | Recovery/Light | below 60% |
| 2 | Endurance | 60–70% |
| 3 | Aerobic | 70–80% |
| 4 | Threshold | 80–90% |
| 5 | Anaerobic | 90% and above |

For example, with a resting heart rate of 60 and a maximum of 180, the reserve is 120 beats. Zone 2 starts at 60 + 60% × 120 = 132 bpm.

**Resting heart rate** comes from your entry in Settings, or else from Apple Health's readings over the last 30 days, or else 60 bpm.

**Maximum heart rate** comes from your entry in Settings, or else 220 minus your age (from your date of birth in Health), or else 190 bpm.

If you know your real numbers, for example from a lab or field test, enter them. They're more accurate than the estimates.

## Set your own zones

In **Settings → HR Zones**:

- Enter **Resting HR** (30–100 bpm) and **Max HR** (100–230 bpm). They must be at least 8 bpm apart. Each field shows the value currently in use as a hint.
- Use the steppers on zones 1 to 4 to move the top of each zone. The zone above it adjusts to match.
- Tap **Reset HR Zones to Defaults** to go back to automatic zones.

If you've adjusted your zones, Acme Ride includes them with the workouts it saves to Apple Health.

## Cadence zones

**Settings → Cadence Zones** works the same way for pedalling cadence, if you have a cadence sensor:

| Zone | Name | Default |
|---|---|---|
| 1 | Recovery | 60–70 rpm |
| 2 | Endurance | 70–85 rpm |
| 3 | Steady State | 85–95 rpm |
| 4 | Race Pace | 95–110 rpm |
| 5 | Sprint | 110+ rpm |

Tap **Reset Cadence Zones to Defaults** to undo your changes.

## How calories are estimated

Acme Ride picks the best method for the data it has:

- **With a heart rate strap** for at least half the ride, it uses your heart rate, weight, age, and sex. This is the most accurate method.
- **Without one**, it estimates the effort of riding from your speed, climbing, air and rolling resistance, and your weight plus a typical 10 kg bike.
- **Without GPS data**, it falls back to a speed-based estimate.

Your weight, age, and sex come from Apple Health. Without a weight in Health, Acme Ride doesn't save calories to Health. To fix that, add your weight in the Health app.
