---
title: Load a route
description: Import a GPX route from the Files app, Mail, Safari, or AirDrop, then find it, filter it, and ride it.
category: Getting started
order: 30
---

Acme Ride rides routes that you plan in another app or website and export as a **GPX** file. Komoot, Ride with GPS, Strava, and most route planners can export GPX. Acme Ride can't create routes itself, and it doesn't read FIT or TCX files.

## Import a route

**From the Routes tab**

1. Open the **Routes** tab.
2. Tap the **Import** button (a down arrow) at the top. On an empty Routes screen, tap **Import Route**.
3. Choose a GPX file in the file picker.

**From another app**

Open or share a `.gpx` file from Files, Mail, Safari, Messages, or AirDrop and choose **Acme Ride**. Acme Ride switches to the Routes tab and imports it.

Routes are imported one file at a time. The route takes its name from the GPX file. If the file has no name inside it, Acme Ride uses the file name.

### What Acme Ride reads from the file

- If the file has both a track and a route, Acme Ride uses the track.
- Turn cues come from the file's waypoints and named route points. Those cues are what turn-by-turn directions announce.
- Elevation, if present, gives you the elevation profile, climbs, and an AI route description.

### If an import fails

| Message | What it means |
|---|---|
| That file isn't valid GPX. | The file is damaged or isn't a GPX file. Export it again from your planner. |
| That file has no route in it. | The file has no track or route points, for example if it holds waypoints only. |
| That file is too large to import. | GPX files must be 16 MB or smaller. |
| That route has too many points to import. | Routes can have up to 100,000 points. Simplify the route in your planner, or split it. |
| That file couldn't be read. | Try saving the file to Files first, then import it from the Routes tab. |
| Still Importing | Another route is still importing. Try again in a moment. |

## Find a route

Each route in the **Routes** tab shows a map thumbnail, its name, a short summary, and its distance.

- Tap **Show on Map** to see your routes on a map. Moving the map filters the list to routes in that area. Tap **Show as List** to go back.
- Tap the **Filter** button to filter by **Distance** and **Elevation Gain**. Routes with no elevation data always show. Tap a filter chip, or **Clear All Filters**, to remove filters.

## Route details

Tap a route to see:

- **Map**: start and finish flags, direction arrows, and the forecast wind along the route.
- **Summary**:
  - a short description;
  - the route's character (Flat, Rolling, Hilly, Mountainous, or Punchy);
  - max grade and hardest climb, with each climb categorized from Cat 4 to HC;
  - road surface, for example "82% paved · 15% gravel · 3% unknown".
- **Elevation Profile**: total gain and loss, if the file includes elevation.
- **Weather** at the start of the route.
- **Previous Rides** on this route.

On iPhones with Apple Intelligence turned on, the summary includes a written description of the route. It's written on your iPhone and never leaves it. It appears only for routes with elevation data.

Road surfaces come from OpenStreetMap. After you import a route, Acme Ride sends the route's line, and only that line, to the OpenStreetMap Overpass service to look them up. If the lookup fails, Acme Ride tries again the next time you open the app. See [How Acme Ride uses your location](/ride/support/location-data/).

## Ride a route

Any of these starts a ride on a route:

- On the route's detail screen, tap **Use Route**.
- In the Routes list, swipe right on a route and tap **Use Route**.
- Tap **Start Ride**, then tap **Route** on the **New Ride** sheet and pick a route.

With a route chosen, the **Turn-by-Turn** switch appears. Leave it on to get an alert and a tone before each turn, or turn it off to just show the route on the map. See [Turn-by-turn directions](/ride/support/turn-by-turn-directions/).

## Delete a route

Swipe left on a route and tap **Delete**. The route is removed right away. Routes can't be renamed in the app, so rename the route in your planner before exporting it.
