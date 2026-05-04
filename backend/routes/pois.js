const express = require("express");
const router  = express.Router();

// POST /api/pois
// Body: { south, north, west, east }
router.post("/", async (req, res) => {
  const { south, north, west, east } = req.body;

  if (!south || !north || !west || !east) {
    return res.status(400).json({ error: "south, north, west, east are required" });
  }

  const q = `[out:json][timeout:25];(
    node["amenity"="bench"](${south},${west},${north},${east});
    node["amenity"="drinking_water"](${south},${west},${north},${east});
    node["amenity"="toilets"](${south},${west},${north},${east});
    node["tourism"="attraction"](${south},${west},${north},${east});
    node["historic"](${south},${west},${north},${east});
    node["leisure"="park"](${south},${west},${north},${east});
  );out body;`;

  try {
    const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    `data=${encodeURIComponent(q)}`,
    });

    if (!overpassRes.ok) {
      return res.status(502).json({ error: `Overpass returned ${overpassRes.status}` });
    }

    const data = await overpassRes.json();
    res.json(data);
  } catch (err) {
    console.error("Overpass error:", err.message);
    res.status(502).json({ error: "Failed to fetch POIs from Overpass" });
  }
});

module.exports = router;
