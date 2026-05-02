const express = require("express");
const router  = express.Router();
const pool    = require("../db");

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

  // Add new columns to existing tables that were created before this migration
  for (const [col, def] of [["route_geometry", "LONGTEXT"], ["survey_data", "TEXT"]]) {
    try {
      await pool.execute(`ALTER TABLE shared_routes ADD COLUMN ${col} ${def}`);
    } catch (e) {
      if (e.code !== "ER_DUP_FIELDNAME") throw e;
    }
  }
}
ensureTable().catch(e => console.error("[shared-routes] Table init failed:", e.message));

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

  const expiry = new Date(scheduled_date + "T00:00:00");
  expiry.setHours(expiry.getHours() + 48);

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
      "SELECT * FROM shared_routes WHERE code = ? AND expires_at > NOW()",
      [req.params.code.toUpperCase()]
    );
    if (!rows.length) return res.status(404).json({ error: "Event not found or has expired" });

    const row = rows[0];
    // Parse stored JSON back to objects for the client
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
