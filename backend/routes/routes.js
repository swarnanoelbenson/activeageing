// backend/routes/routes.js — POST /api/routes  &  POST /api/routes/waypoint
//
// /api/routes       — generates up to 3 round-trip route variants via OpenRouteService
//                     using seed 0/1/2 for variety (different random loops, same length).
// /api/routes/waypoint — calculates a custom route through caller-supplied waypoints,
//                     appending the start coordinate at the end to close the loop.

const express = require("express");
const router  = express.Router();

const ORS_BASE = "https://api.openrouteservice.org/v2/directions";

// Approximate speeds in km/h used to convert user-selected duration → target distance.
// Jogging re-uses the foot-walking ORS profile because ORS has no separate jog profile;
// the speed difference is handled client-side via SPEEDS, not by the routing engine.
const SPEEDS = {
  walking: { easy: 3.5, moderate: 5.0, brisk:  6.5 },
  jogging: { easy: 6.0, moderate: 8.0, brisk: 10.0 },
  cycling: { easy: 10,  moderate: 15,  brisk:  20  },
};

// ORS profile strings — jogging maps to foot-walking because ORS has no jogging profile
const ORS_PROFILE = {
  walking: "foot-walking",
  jogging: "foot-walking",
  cycling: "cycling-regular",
};

// POST /api/routes
// Body: { activity_type, duration_minutes, preferred_pace, environment_pref, rest_stops,
//         start_lat, start_lng }
router.post("/", async (req, res) => {
  const {
    activity_type    = "walking",
    duration_minutes = 30,
    preferred_pace   = "moderate",
    environment_pref = "mix",
    start_lat,
    start_lng,
  } = req.body;

  if (!start_lat || !start_lng) {
    return res.status(400).json({ error: "start_lat and start_lng are required" });
  }

  const speedKmh   = (SPEEDS[activity_type] ?? SPEEDS.walking)[preferred_pace] ?? 5;
  // Convert duration + pace to a target loop length in metres for ORS round_trip
  const targetMeters = Math.round(speedKmh * (Number(duration_minutes) / 60) * 1000);

  const profile = ORS_PROFILE[activity_type] ?? "foot-walking";

  // avoid_features "highways" is only valid for driving profiles — omitting it for foot/cycling
  // avoids an ORS 400 error
  const avoidFeatures = [];

  // seed produces distinct loop shapes for the same start + length; 0/1/2 gives 3 variety options
  const buildBody = (seed) => ({
    coordinates: [[Number(start_lng), Number(start_lat)]],
    options: {
      round_trip: { length: targetMeters, points: 3, seed },
      ...(avoidFeatures.length ? { avoid_features: avoidFeatures } : {}),
    },
  });

  try {
    const headers = {
      "Content-Type":  "application/json",
      "Accept":        "application/json, application/geo+json",
      "Authorization": process.env.ORS_API_KEY,
    };

    // All 3 seeds in parallel — ORS free tier allows concurrent requests
    const responses = await Promise.all(
      [0, 1, 2].map((seed) =>
        fetch(`${ORS_BASE}/${profile}/geojson`, {
          method:  "POST",
          headers,
          body:    JSON.stringify(buildBody(seed)),
        }).then((r) => r.json())
      )
    );

    // Log ORS errors so we can diagnose quota/profile issues without crashing the request
    responses.forEach((r, i) => {
      if (!r.features) console.error(`ORS seed ${i} error:`, JSON.stringify(r));
    });

    const routes = responses
      .filter((r) => r.features?.length > 0)
      .map((r, i) => {
        const feature  = r.features[0];
        const summary  = feature.properties.summary;
        return {
          index:            i,
          geometry:         feature.geometry,           // GeoJSON LineString
          distance_m:       Math.round(summary.distance),
          duration_s:       Math.round(summary.duration),
          distance_label:   formatDistance(summary.distance),
          duration_label:   formatDuration(summary.duration),
        };
      });

    if (routes.length === 0) {
      return res.status(502).json({ error: "ORS returned no routes" });
    }

    res.json({ routes });
  } catch (err) {
    console.error("ORS error:", err.message);
    res.status(502).json({ error: "Failed to fetch routes from ORS" });
  }
});

function formatDistance(meters) {
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)} km`
    : `${Math.round(meters)} m`;
}

function formatDuration(seconds) {
  const m = Math.round(seconds / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}min`;
}

// POST /api/routes/waypoint
// Body: { activity_type, start_lat, start_lng, waypoints: [[lng, lat], ...] }
router.post("/waypoint", async (req, res) => {
  const { activity_type = "walking", start_lat, start_lng, waypoints = [] } = req.body;

  if (!start_lat || !start_lng) {
    return res.status(400).json({ error: "start_lat and start_lng are required" });
  }
  if (!waypoints.length) {
    return res.status(400).json({ error: "At least one waypoint is required" });
  }

  const profile = ORS_PROFILE[activity_type] ?? "foot-walking";
  // Duplicate start coord at end so ORS routes back to the origin (round-trip via waypoints)
  const coordinates = [
    [Number(start_lng), Number(start_lat)],
    ...waypoints,
    [Number(start_lng), Number(start_lat)],
  ];

  const headers = {
    "Content-Type":  "application/json",
    "Accept":        "application/json, application/geo+json",
    "Authorization": process.env.ORS_API_KEY,
  };

  try {
    const r    = await fetch(`${ORS_BASE}/${profile}/geojson`, {
      method: "POST", headers, body: JSON.stringify({ coordinates }),
    });
    const data = await r.json();

    if (!data.features?.length) {
      return res.status(502).json({ error: data.error?.message ?? "ORS returned no route for these waypoints" });
    }

    const feature = data.features[0];
    const summary = feature.properties.summary;

    res.json({
      geometry:       feature.geometry,
      distance_m:     Math.round(summary.distance),
      duration_s:     Math.round(summary.duration),
      distance_label: formatDistance(summary.distance),
      duration_label: formatDuration(summary.duration),
    });
  } catch (err) {
    console.error("ORS waypoint error:", err.message);
    res.status(502).json({ error: "Failed to fetch waypoint route from ORS" });
  }
});

module.exports = router;
