// backend/routes/shared-routes.js — POST /api/shared-routes  &  GET /api/shared-routes/:code
//
// Lets users share a planned route via a short code.
// POST creates the record and returns a 6-char base36 code.
// GET retrieves it, but only if the exact code is known — there is no public listing endpoint.
// Routes expire 48 hours after the scheduled event date.

const express = require("express");
const router  = express.Router();
const pool    = require("../db");

// ensureTable runs once at module load. CREATE TABLE IF NOT EXISTS is idempotent so it's
// safe to call on every cold start. The ALTER TABLE loop adds columns added in later
// migrations (route_geometry, survey_data) to tables created before those columns existed;
// ER_DUP_FIELDNAME is silently swallowed because the column already being there is success.
async function ensureTable() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS shared_routes (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      code           VARCHAR(8) NOT NULL UNIQUE,
      activity_type  VARCHAR(20),
      distance_label VARCHAR(40),
      duration_label VARCHAR(40),
      preferred_pace VARCHAR(20),
      start_address  VARCHAR(255),
      scheduled_date DATE,
      expires_at     DATETIME NOT NULL,
      created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
      route_geometry LONGTEXT,
      survey_data    TEXT
    )
  `);

  for (const [col, def] of [["route_geometry", "LONGTEXT"], ["survey_data", "TEXT"]]) {
    try {
      await pool.execute(`ALTER TABLE shared_routes ADD COLUMN ${col} ${def}`);
    } catch (e) {
      if (e.code !== "ER_DUP_FIELDNAME") throw e;
    }
  }
}
ensureTable().catch(e => console.error("[shared-routes] Table init failed:", e.message));

// 6-char base36 uppercase codes — short enough to read aloud, ~2B combinations before
// a collision is likely, which is well above any expected usage volume.
function generateCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// POST /api/shared-routes — save a new shared route event (code-gated; no public listing)
router.post("/", async (req, res) => {
  const {
    activity_type, distance_label, duration_label, preferred_pace,
    start_address, scheduled_date, route_geometry, survey_data,
  } = req.body;
  if (!scheduled_date) return res.status(400).json({ error: "scheduled_date is required" });

  // Expiry = event date + 48h so the code stays valid through the day-after in case
  // participants are still looking it up while walking
  const expiry = new Date(scheduled_date + "T00:00:00");
  expiry.setHours(expiry.getHours() + 48);

  // Retry loop handles the rare case where a generated code collides with an existing one.
  // 5 attempts is generous — probability of 5 consecutive collisions is negligible.
  let code;
  for (let i = 0; i < 5; i++) {
    code = generateCode();
    try {
      await pool.execute(
        `INSERT INTO shared_routes
         (code, activity_type, distance_label, duration_label, preferred_pace,
          start_address, scheduled_date, expires_at, route_geometry, survey_data)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          code,
          activity_type  || null,
          distance_label || null,
          duration_label || null,
          preferred_pace || null,
          start_address  || null,
          scheduled_date,
          expiry,
          route_geometry ? JSON.stringify(route_geometry) : null,
          survey_data    ? JSON.stringify(survey_data)    : null,
        ]
      );
      return res.json({ code, expires_at: expiry.toISOString() });
    } catch (e) {
      if (e.code === "ER_DUP_ENTRY") continue;
      return res.status(500).json({ error: e.message });
    }
  }
  res.status(500).json({ error: "Could not generate unique code" });
});

// GET /api/shared-routes/:code — retrieve a route by code (only accessible with exact code)
router.get("/:code", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      // expires_at > NOW() enforces expiry server-side so expired codes return 404
      "SELECT * FROM shared_routes WHERE code = ? AND expires_at > NOW()",
      [req.params.code.toUpperCase()]
    );
    if (!rows.length) return res.status(404).json({ error: "Event not found or has expired" });

    const row = rows[0];
    // Deserialise JSON columns — stored as text in MySQL, must be parsed before sending
    if (row.route_geometry && typeof row.route_geometry === "string") {
      try { row.route_geometry = JSON.parse(row.route_geometry); } catch (_) {}
    }
    if (row.survey_data && typeof row.survey_data === "string") {
      try { row.survey_data = JSON.parse(row.survey_data); } catch (_) {}
    }

    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
