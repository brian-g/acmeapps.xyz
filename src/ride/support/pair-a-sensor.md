---
title: Pair a sensor
description: Connect a Bluetooth heart rate strap, speed or cadence sensor, or Garmin Varia radar, and manage the sensors you've paired.
category: Getting started
order: 20
---

Acme Ride connects to Bluetooth Low Energy sensors that use the standard heart rate and cycling speed and cadence services, and to Garmin Varia radars.

## Supported sensors

| Type | Examples |
|---|---|
| Heart rate | Any Bluetooth heart rate strap, such as the Polar H10, Wahoo TICKR, or Garmin HRM-Pro |
| Speed, cadence, or combined speed/cadence | Any sensor using the Bluetooth Cycling Speed and Cadence service |
| Radar | Garmin Varia RTL515 and RCT715 |

**Not supported:** power meters, ANT+ only sensors, and the Garmin Varia RearVue 820, which uses a secured connection that other apps can't read.

You can pair one sensor for each role: one radar, one heart rate sensor, one speed sensor, and one cadence sensor. A combined speed/cadence sensor can fill both the speed and cadence roles.

## Pair a sensor

1. Wake the sensor. Spin the wheel or crank for a speed or cadence sensor, put on and moisten a heart rate strap, or switch on the radar.
2. In Acme Ride, go to **Settings → Sensors**. The **Manage Sensors** screen opens and starts searching.
3. Find your sensor in the list and tap **Pair**.

Radars and heart rate straps pair right away. For a speed or cadence sensor, Acme Ride connects first to find out what the sensor measures:

- If it reports only wheel data or only crank data, it becomes your speed or cadence sensor.
- If it reports both, Acme Ride asks **What should this sensor do?** Choose **Speed**, **Cadence**, or **Both**.

To change a combined sensor's role later, tap its row in **Manage Sensors** and choose again.

### Replacing a sensor

If a role already has a sensor, Acme Ride asks before replacing it, for example "Heart Rate is already assigned to TICKR." Tap **Replace** to use the new sensor, or **Cancel** to keep the old one.

## The Manage Sensors list

- Paired sensors appear first, then unpaired sensors nearby.
- Under each paired sensor you'll see its role, such as "Heart Rate" or "Speed · Cadence", or a status such as **Connecting…**, **Reconnecting…**, **Searching…**, or **Disconnected**.
- A battery percentage appears while a sensor is connected, if the sensor reports one. It turns red at 20% or below.
- The list keeps searching while it's open, and you can pull down to search again. A sensor that stops broadcasting drops off the list after about 20 seconds.
- Sensors without a name appear as **Unknown Sensor**.

## Unpair a sensor

Tap **Unpair** next to the sensor. This happens right away and removes every role the sensor held. You can pair it again at any time.

## Connecting and reconnecting

Acme Ride connects only to sensors you've paired, and it ignores other sensors nearby. When you open the **New Ride** sheet, it starts looking for your sensors so they're connected before you start. The **Sensors** section of that sheet shows each one as **Connected** or **Searching**.

During a ride, Acme Ride keeps trying to reconnect a sensor that drops out, with no limit on attempts. While it's gone:

- **Speed** switches to GPS, with a banner such as "Switched to GPS for speed — Speed sensor not responding".
- **Heart rate** uses Apple Watch readings from Apple Health if they're available. These come in only every few minutes unless you're also recording a workout on the watch.
- **Radar** shows as offline after 10 seconds, with a single gentle haptic.

If a sensor needs attention during a ride, a **Sensors** button appears in the ride controls. Tap it to see each sensor's status and battery. When you finish a ride, Acme Ride disconnects your sensors but keeps them paired.

After a ride, the summary notes any sensor with a low battery or an unreliable connection. The next **New Ride** sheet repeats the note, for example "Unreliable connection on last ride — check battery or mount".

## If your sensor doesn't appear

- Make sure it's awake and close to your iPhone. Most sensors sleep after a few minutes without movement.
- Many sensors accept only one Bluetooth connection at a time. Close other cycling apps, and turn off Bluetooth pairing on bike computers or watches that might be holding the connection.
- Check that Bluetooth is on and that Acme Ride is allowed to use it in **iOS Settings → Acme Ride**.
- Replace the sensor's battery if it's low.

More fixes are in [Troubleshooting](/ride/support/troubleshooting/).
