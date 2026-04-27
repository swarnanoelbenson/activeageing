const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /api/routesurvey
// Body: { activity_type, duration_minutes, preferred_pace, environment_pref, rest_stops,
//         start_address?, start_lat?, start_lng? }
router.post("/", async (req, res) => {
  const {
    activity_type, duration_minutes, preferred_pace, environment_pref, rest_stops,
    start_address = null, start_lat = null, start_lng = null,
  } = req.body;

  const valid = {
    activity_type:    ["walking", "cycling", "jogging"],
    duration_minutes: [15, 30, 45, 60],
    preferred_pace:   ["easy", "moderate", "brisk"],
    environment_pref: ["parks", "streets", "mix"],
    rest_stops:       ["yes", "ifneeded", "nopref"],
  };

  if (
    !valid.activity_type.includes(activity_type) ||
    !valid.duration_minutes.includes(Number(duration_minutes)) ||
    !valid.preferred_pace.includes(preferred_pace) ||
    !valid.environment_pref.includes(environment_pref) ||
    !valid.rest_stops.includes(rest_stops)
  ) {
    return res.status(400).json({ error: "Invalid or missing survey answers" });
  }

  const lat = start_lat  != null ? parseFloat(start_lat)  : null;
  const lng = start_lng  != null ? parseFloat(start_lng)  : null;

  try {
    const [result] = await pool.query(
      `INSERT INTO route_survey_responses
        (activity_type, duration_minutes, preferred_pace, environment_pref, rest_stops,
         start_address, start_lat, start_lng)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [activity_type, Number(duration_minutes), preferred_pace, environment_pref, rest_stops,
       start_address, lat, lng]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("DB error saving route survey:", err.message);
    res.status(500).json({ error: "Failed to save route survey" });
  }
});

module.exports = router;
